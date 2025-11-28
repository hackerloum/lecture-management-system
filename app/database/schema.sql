-- =====================================================
-- Lecturer Management System Database Schema
-- Supabase PostgreSQL Database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. ORGANIZATIONS
-- =====================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    website VARCHAR(255),
    logo_url TEXT,
    subscription_tier VARCHAR(50) DEFAULT 'free',
    max_lecturers INTEGER DEFAULT 1,
    max_students INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. USER PROFILES (Extended from Supabase Auth)
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('lecturer', 'student', 'admin', 'ta')),
    avatar_url TEXT,
    phone VARCHAR(50),
    bio TEXT,
    department VARCHAR(255),
    employee_id VARCHAR(100),
    student_id VARCHAR(100),
    major VARCHAR(255),
    year VARCHAR(50),
    gpa DECIMAL(3, 2),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 3. COURSES
-- =====================================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    semester VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    color VARCHAR(50) DEFAULT 'blue',
    syllabus TEXT,
    room VARCHAR(100),
    credits INTEGER DEFAULT 3,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(organization_id, code, semester, year)
);

-- =====================================================
-- 4. COURSE COLLABORATORS
-- =====================================================
CREATE TABLE course_collaborators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('instructor', 'co_instructor', 'ta', 'grader')),
    permissions JSONB DEFAULT '{"can_grade": true, "can_manage": false, "can_edit": false}',
    added_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, profile_id)
);

-- =====================================================
-- 5. COURSE ENROLLMENTS
-- =====================================================
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed', 'pending')),
    final_grade DECIMAL(5, 2),
    letter_grade VARCHAR(5),
    credits_earned INTEGER,
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, student_id)
);

-- =====================================================
-- 6. SCHEDULES
-- =====================================================
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(100),
    building VARCHAR(255),
    type VARCHAR(50) DEFAULT 'lecture' CHECK (type IN ('lecture', 'lab', 'tutorial', 'office_hours', 'exam', 'meeting')),
    recurring BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    instructor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 7. ASSIGNMENTS
-- =====================================================
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    category_id UUID, -- References grade_categories(id)
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'assignment' CHECK (type IN ('assignment', 'quiz', 'exam', 'project', 'lab', 'homework')),
    max_points DECIMAL(10, 2) NOT NULL,
    weight DECIMAL(5, 2) DEFAULT 0, -- Percentage weight in final grade
    due_date TIMESTAMPTZ,
    allow_late_submission BOOLEAN DEFAULT TRUE,
    late_penalty_per_day DECIMAL(5, 2) DEFAULT 0,
    instructions TEXT,
    attachments JSONB DEFAULT '[]',
    rubric JSONB,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. GRADE CATEGORIES
-- =====================================================
CREATE TABLE grade_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(5, 2) NOT NULL, -- Percentage weight
    color VARCHAR(50) DEFAULT 'blue',
    drop_lowest INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key to assignments
ALTER TABLE assignments ADD CONSTRAINT fk_assignment_category 
    FOREIGN KEY (category_id) REFERENCES grade_categories(id) ON DELETE SET NULL;

-- =====================================================
-- 9. SUBMISSIONS
-- =====================================================
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    content TEXT,
    attachments JSONB DEFAULT '[]', -- Array of file URLs/metadata
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    is_late BOOLEAN DEFAULT FALSE,
    late_days INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'graded', 'returned')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

-- =====================================================
-- 10. GRADES
-- =====================================================
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    points_earned DECIMAL(10, 2),
    points_possible DECIMAL(10, 2),
    percentage DECIMAL(5, 2),
    letter_grade VARCHAR(5),
    feedback TEXT,
    graded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    graded_at TIMESTAMPTZ,
    rubric_scores JSONB, -- Detailed rubric scoring
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(submission_id)
);

-- =====================================================
-- 11. ATTENDANCE SESSIONS
-- =====================================================
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES schedules(id) ON DELETE SET NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    qr_code_url TEXT,
    session_date DATE NOT NULL,
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    time_limit_minutes INTEGER DEFAULT 15,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'ended', 'expired', 'cancelled')),
    total_students INTEGER DEFAULT 0,
    present_count INTEGER DEFAULT 0,
    absent_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 12. ATTENDANCE RECORDS
-- =====================================================
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    check_in_time TIMESTAMPTZ DEFAULT NOW(),
    student_name VARCHAR(255), -- Cached for verification
    student_identifier VARCHAR(100), -- Student ID used during check-in
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

-- =====================================================
-- 13. ANNOUNCEMENTS
-- =====================================================
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_pinned BOOLEAN DEFAULT FALSE,
    attachments JSONB DEFAULT '[]',
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 14. COURSE MATERIALS
-- =====================================================
CREATE TABLE course_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('slides', 'video', 'document', 'link', 'audio', 'other')),
    file_url TEXT,
    file_size BIGINT,
    file_type VARCHAR(100),
    is_public BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 15. MESSAGES / CHAT
-- =====================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- NULL for broadcast to all
    thread_id UUID REFERENCES messages(id) ON DELETE SET NULL, -- For replies
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 16. NOTIFICATIONS
-- =====================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('assignment_due', 'grade_posted', 'announcement', 'message', 'attendance', 'system')),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 17. STUDENT BADGES / ACHIEVEMENTS
-- =====================================================
CREATE TABLE student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    badge_type VARCHAR(100) NOT NULL,
    badge_name VARCHAR(255) NOT NULL,
    badge_icon TEXT,
    description TEXT,
    points_awarded INTEGER DEFAULT 0,
    awarded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id, badge_type)
);

-- =====================================================
-- 18. STUDENT PROGRESS / STATS
-- =====================================================
CREATE TABLE student_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    total_points DECIMAL(10, 2) DEFAULT 0,
    earned_points DECIMAL(10, 2) DEFAULT 0,
    current_grade DECIMAL(5, 2),
    attendance_percentage DECIMAL(5, 2) DEFAULT 0,
    assignments_completed INTEGER DEFAULT 0,
    assignments_total INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    last_active_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, course_id)
);

-- =====================================================
-- 19. INVITATIONS
-- =====================================================
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('lecturer', 'student', 'admin')),
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL, -- For course-specific invites
    invited_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 20. PRESENTATIONS
-- =====================================================
CREATE TABLE presentations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    slides JSONB DEFAULT '[]', -- Array of slide data
    current_slide INTEGER DEFAULT 0,
    is_live BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_organization ON profiles(organization_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_student_id ON profiles(student_id) WHERE student_id IS NOT NULL;

-- Courses indexes
CREATE INDEX idx_courses_organization ON courses(organization_id);
CREATE INDEX idx_courses_created_by ON courses(created_by);
CREATE INDEX idx_courses_semester_year ON courses(semester, year);

-- Course collaborators indexes
CREATE INDEX idx_collaborators_course ON course_collaborators(course_id);
CREATE INDEX idx_collaborators_profile ON course_collaborators(profile_id);

-- Enrollments indexes
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_enrollments_student ON course_enrollments(student_id);

-- Schedules indexes
CREATE INDEX idx_schedules_course ON schedules(course_id);
CREATE INDEX idx_schedules_day ON schedules(day_of_week);

-- Assignments indexes
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_category ON assignments(category_id);

-- Submissions indexes
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_course ON submissions(course_id);

-- Grades indexes
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_course ON grades(course_id);
CREATE INDEX idx_grades_assignment ON grades(assignment_id);

-- Attendance indexes
CREATE INDEX idx_attendance_sessions_course ON attendance_sessions(course_id);
CREATE INDEX idx_attendance_sessions_token ON attendance_sessions(token);
CREATE INDEX idx_attendance_sessions_date ON attendance_sessions(session_date);
CREATE INDEX idx_attendance_records_session ON attendance_records(session_id);
CREATE INDEX idx_attendance_records_student ON attendance_records(student_id);

-- Messages indexes
CREATE INDEX idx_messages_course ON messages(course_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Student progress indexes
CREATE INDEX idx_progress_student ON student_progress(student_id);
CREATE INDEX idx_progress_course ON student_progress(course_id);

-- Invitations indexes
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_status ON invitations(status);

-- =====================================================
-- TRIGGERS for updated_at timestamps
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- TRIGGER to automatically create profile on user signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role VARCHAR(50);
    v_full_name VARCHAR(255);
BEGIN
    -- Extract full_name from metadata
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'User');
    
    -- Map role from metadata to database role
    -- Default to 'lecturer' for signups (since this is a lecturer management system)
    v_role := 'lecturer';
    
    -- If role is specified in metadata, try to map it
    IF NEW.raw_user_meta_data->>'role' IS NOT NULL THEN
        CASE NEW.raw_user_meta_data->>'role'
            WHEN 'student' THEN v_role := 'student';
            WHEN 'admin' THEN v_role := 'admin';
            WHEN 'ta' THEN v_role := 'ta';
            ELSE v_role := 'lecturer';
        END CASE;
    END IF;
    
    -- Insert into profiles table
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        v_full_name,
        v_role
    )
    ON CONFLICT (id) DO NOTHING; -- Prevent errors if profile already exists
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON course_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grade_categories_updated_at BEFORE UPDATE ON grade_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_sessions_updated_at BEFORE UPDATE ON attendance_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON course_materials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_presentations_updated_at BEFORE UPDATE ON presentations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (customize based on your needs)
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- Users can insert their own profile (for signup)
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Lecturers can view courses they collaborate on
CREATE POLICY "Lecturers can view courses" ON courses FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM course_collaborators 
            WHERE course_id = courses.id 
            AND profile_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'lecturer')
        )
    );

-- Students can view courses they're enrolled in
CREATE POLICY "Students can view enrolled courses" ON courses FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_id = courses.id 
            AND student_id = auth.uid()
        )
    );

-- Note: Add more comprehensive RLS policies based on your security requirements

-- =====================================================
-- FUNCTIONS and VIEWS
-- =====================================================

-- Function to get student's current grade in a course
CREATE OR REPLACE FUNCTION get_student_course_grade(p_student_id UUID, p_course_id UUID)
RETURNS DECIMAL(5, 2) AS $$
DECLARE
    v_final_grade DECIMAL(5, 2);
BEGIN
    SELECT final_grade INTO v_final_grade
    FROM course_enrollments
    WHERE student_id = p_student_id AND course_id = p_course_id;
    
    RETURN COALESCE(v_final_grade, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for course statistics
CREATE VIEW course_statistics AS
SELECT 
    c.id,
    c.code,
    c.name,
    COUNT(DISTINCT ce.student_id) as total_students,
    COUNT(DISTINCT a.id) as total_assignments,
    AVG(sp.current_grade) as average_grade,
    AVG(sp.attendance_percentage) as average_attendance
FROM courses c
LEFT JOIN course_enrollments ce ON c.id = ce.course_id AND ce.status = 'active'
LEFT JOIN assignments a ON c.id = a.course_id
LEFT JOIN student_progress sp ON c.id = sp.course_id
GROUP BY c.id, c.code, c.name;

-- =====================================================
-- COMMENTS for Documentation
-- =====================================================

COMMENT ON TABLE organizations IS 'Educational institutions using the system';
COMMENT ON TABLE profiles IS 'Extended user profiles linked to Supabase Auth';
COMMENT ON TABLE courses IS 'Academic courses managed by lecturers';
COMMENT ON TABLE course_collaborators IS 'Lecturers, TAs, and graders for courses';
COMMENT ON TABLE course_enrollments IS 'Student enrollments in courses';
COMMENT ON TABLE schedules IS 'Class schedules and timetables';
COMMENT ON TABLE assignments IS 'Course assignments, quizzes, exams';
COMMENT ON TABLE grade_categories IS 'Categories for weighted grading';
COMMENT ON TABLE submissions IS 'Student assignment submissions';
COMMENT ON TABLE grades IS 'Grades for assignments and submissions';
COMMENT ON TABLE attendance_sessions IS 'QR code attendance sessions';
COMMENT ON TABLE attendance_records IS 'Individual attendance records';
COMMENT ON TABLE announcements IS 'Course announcements';
COMMENT ON TABLE course_materials IS 'Course materials and resources';
COMMENT ON TABLE messages IS 'Messages and chat between users';
COMMENT ON TABLE notifications IS 'System notifications for users';
COMMENT ON TABLE student_badges IS 'Gamification badges and achievements';
COMMENT ON TABLE student_progress IS 'Student progress tracking and stats';
COMMENT ON TABLE invitations IS 'User invitation system';
COMMENT ON TABLE presentations IS 'Interactive presentation system';

