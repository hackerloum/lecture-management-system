# Database Schema Documentation

This document describes the database schema for the Lecturer Management System.

## Overview

The database uses PostgreSQL and is designed to work with Supabase. It includes comprehensive tables for managing courses, students, attendance, grades, and all other features of the system.

## Database Structure

### Core Tables

#### 1. **organizations**
Stores educational institutions using the system.
- Supports multi-tenant architecture
- Subscription tiers and limits
- Organization branding (logo, website)

#### 2. **profiles**
Extended user profiles linked to Supabase Auth users.
- Supports lecturers, students, admins, and TAs
- Student information (major, year, GPA)
- Two-factor authentication settings
- Last login tracking

#### 3. **courses**
Academic courses managed by lecturers.
- Course code, name, description
- Semester and year tracking
- Status management (active, archived, draft)
- Room and schedule information

### Relationship Tables

#### 4. **course_collaborators**
Manages multiple lecturers/TAs per course.
- Roles: instructor, co_instructor, ta, grader
- Granular permissions (can_grade, can_manage, can_edit)

#### 5. **course_enrollments**
Links students to courses.
- Enrollment status tracking
- Final grades and letter grades
- Credits earned

### Academic Tables

#### 6. **schedules**
Class schedules and timetables.
- Day of week, start/end times
- Room and building information
- Recurring or one-time events
- Multiple types (lecture, lab, office hours, etc.)

#### 7. **assignments**
Course assignments, quizzes, exams, and projects.
- Points and weight calculation
- Due dates with late submission handling
- Attachments and rubrics
- Status (draft, published, closed)

#### 8. **grade_categories**
Categories for weighted grading.
- Custom category weights
- Drop lowest assignment option
- Color coding for UI

#### 9. **submissions**
Student assignment submissions.
- File attachments (JSONB array)
- Late submission tracking
- Status workflow

#### 10. **grades**
Grading information for submissions.
- Points earned vs. possible
- Percentage and letter grades
- Detailed feedback
- Rubric-based scoring

### Attendance System

#### 11. **attendance_sessions**
QR code-based attendance sessions.
- Unique token for each session
- Time-limited sessions
- QR code URL storage
- Session statistics

#### 12. **attendance_records**
Individual attendance records.
- Status (present, absent, late, excused)
- Check-in timestamps
- Student verification data

### Communication & Content

#### 13. **announcements**
Course announcements.
- Priority levels
- Pinning capability
- File attachments

#### 14. **course_materials**
Course resources and materials.
- Multiple types (slides, videos, documents, links)
- File storage URLs
- Public/private visibility

#### 15. **messages**
Messaging and chat system.
- Course-wide or private messages
- Threading support
- Read status tracking

#### 16. **notifications**
System notifications.
- Multiple notification types
- Read/unread status
- Action links

### Gamification & Progress

#### 17. **student_badges**
Achievements and badges for students.
- Badge types and names
- Points awarded
- Course-specific or general

#### 18. **student_progress**
Student progress tracking.
- Current grade calculations
- Attendance percentages
- Assignment completion stats
- Experience points and levels

### Additional Features

#### 19. **invitations**
User invitation system.
- Token-based invitations
- Role assignment
- Expiration handling

#### 20. **presentations**
Interactive presentation system.
- Slide management
- Live presentation tracking

## Setup Instructions

### 1. Run the Schema in Supabase

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `schema.sql`
4. Paste and run the SQL script

### 2. Verify Tables Created

You can verify all tables were created by running:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

### 3. Set Up Row Level Security (RLS)

The schema includes basic RLS policies. You may need to customize them based on your security requirements. To review current policies:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public';
```

### 4. Create Initial Organization

After running the schema, create your first organization:

```sql
INSERT INTO organizations (name, slug, email)
VALUES ('Your Institution', 'your-institution', 'admin@institution.edu')
RETURNING id;
```

### 5. Link Supabase Auth to Profiles

Create a trigger to automatically create a profile when a user signs up:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Relationships Diagram

```
organizations
    ├── profiles (lecturers & students)
    │   ├── course_collaborators
    │   └── course_enrollments
    │
    └── courses
        ├── course_collaborators
        ├── course_enrollments
        ├── schedules
        ├── assignments
        │   ├── submissions
        │   └── grades
        ├── grade_categories
        ├── attendance_sessions
        │   └── attendance_records
        ├── announcements
        ├── course_materials
        ├── messages
        ├── notifications
        ├── student_badges
        ├── student_progress
        ├── invitations
        └── presentations
```

## Indexes

The schema includes comprehensive indexes for:
- Foreign key relationships
- Frequently queried columns (email, student_id, etc.)
- Date-based queries (due dates, session dates)
- Full-text search support (where applicable)

## Security Considerations

1. **Row Level Security (RLS)**: All tables have RLS enabled with basic policies. Customize based on your needs.

2. **Data Validation**: Constraints ensure data integrity (CHECK constraints, foreign keys, UNIQUE constraints).

3. **Timestamps**: All tables include `created_at` and `updated_at` with automatic triggers.

4. **Soft Deletes**: Consider adding `deleted_at` columns if you need soft delete functionality.

## Future Enhancements

Consider adding:
- File storage integration with Supabase Storage
- Full-text search indexes for announcements, assignments
- Audit logs for sensitive operations
- Backup and archival strategies
- Performance monitoring queries

## Query Examples

### Get all courses for a lecturer

```sql
SELECT c.*, o.name as organization_name
FROM courses c
JOIN course_collaborators cc ON c.id = cc.course_id
JOIN organizations o ON c.organization_id = o.id
WHERE cc.profile_id = 'lecturer-uuid-here'
AND c.status = 'active';
```

### Get student grades for a course

```sql
SELECT 
    a.title as assignment,
    g.points_earned,
    g.points_possible,
    g.percentage,
    g.letter_grade
FROM grades g
JOIN assignments a ON g.assignment_id = a.id
WHERE g.student_id = 'student-uuid-here'
AND g.course_id = 'course-uuid-here'
ORDER BY a.due_date DESC;
```

### Get attendance statistics

```sql
SELECT 
    ar.student_id,
    p.full_name,
    COUNT(*) FILTER (WHERE ar.status = 'present') as present_count,
    COUNT(*) as total_sessions,
    ROUND(
        COUNT(*) FILTER (WHERE ar.status = 'present')::decimal / 
        NULLIF(COUNT(*), 0) * 100, 
        2
    ) as attendance_percentage
FROM attendance_records ar
JOIN profiles p ON ar.student_id = p.id
WHERE ar.course_id = 'course-uuid-here'
GROUP BY ar.student_id, p.full_name;
```

## Support

For questions or issues with the database schema, please refer to:
- Supabase Documentation: https://supabase.com/docs
- PostgreSQL Documentation: https://www.postgresql.org/docs/

