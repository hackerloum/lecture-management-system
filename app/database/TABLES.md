# Database Tables Quick Reference

## Core System Tables (3)

| Table Name | Description | Key Fields |
|------------|-------------|------------|
| `organizations` | Educational institutions | id, name, slug, subscription_tier |
| `profiles` | User profiles (linked to Supabase Auth) | id, email, full_name, role, organization_id |
| `courses` | Academic courses | id, code, name, semester, year, organization_id |

## Relationship Tables (2)

| Table Name | Description | Key Fields |
|------------|-------------|------------|
| `course_collaborators` | Lecturers/TAs per course | course_id, profile_id, role, permissions |
| `course_enrollments` | Students enrolled in courses | course_id, student_id, status, final_grade |

## Academic Management Tables (5)

| Table Name | Description | Key Fields |
|------------|-------------|------------|
| `schedules` | Class schedules and timetables | course_id, day_of_week, start_time, end_time, room |
| `assignments` | Assignments, quizzes, exams | id, course_id, title, type, max_points, due_date |
| `grade_categories` | Grading categories with weights | id, course_id, name, weight, color |
| `submissions` | Student assignment submissions | id, assignment_id, student_id, submitted_at, status |
| `grades` | Grades and feedback | id, submission_id, points_earned, percentage, feedback |

## Attendance System Tables (2)

| Table Name | Description | Key Fields |
|------------|-------------|------------|
| `attendance_sessions` | QR code attendance sessions | id, course_id, token, session_date, time_limit_minutes |
| `attendance_records` | Individual attendance records | id, session_id, student_id, status, check_in_time |

## Communication & Content Tables (4)

| Table Name | Description | Key Fields |
|------------|-------------|------------|
| `announcements` | Course announcements | id, course_id, title, content, priority, is_pinned |
| `course_materials` | Course resources and files | id, course_id, title, type, file_url |
| `messages` | Messaging and chat | id, course_id, sender_id, recipient_id, content |
| `notifications` | System notifications | id, user_id, type, title, message, is_read |

## Progress & Gamification Tables (2)

| Table Name | Description | Key Fields |
|------------|-------------|------------|
| `student_badges` | Achievements and badges | id, student_id, course_id, badge_type, points_awarded |
| `student_progress` | Student progress tracking | id, student_id, course_id, current_grade, attendance_percentage, experience_points |

## Additional Feature Tables (2)

| Table Name | Description | Key Fields |
|------------|-------------|------------|
| `invitations` | User invitation system | id, email, token, role, status, expires_at |
| `presentations` | Interactive presentations | id, course_id, title, slides, is_live |

---

## Total: 20 Tables

### Relationships Summary

- **1-to-Many**: organizations → profiles, courses, invitations
- **Many-to-Many**: courses ↔ profiles (via course_collaborators and course_enrollments)
- **1-to-Many**: courses → assignments, schedules, announcements, materials, messages
- **1-to-Many**: assignments → submissions → grades
- **1-to-Many**: attendance_sessions → attendance_records
- **1-to-Many**: profiles → notifications, student_progress, student_badges

### Key Features by Table

**Multi-tenancy**: `organizations` table supports multiple institutions

**User Management**: `profiles` table extends Supabase Auth users

**Role-based Access**: Roles defined in `profiles.role` and `course_collaborators.role`

**Weighted Grading**: `grade_categories` supports category-based weighted grading

**Secure Attendance**: Token-based QR code system via `attendance_sessions` and `attendance_records`

**Gamification**: Experience points and levels tracked in `student_progress` and `student_badges`

**Communication**: Course-wide messaging via `messages` and announcements via `announcements`

**File Management**: Attachments stored as JSONB arrays in multiple tables (assignments, submissions, announcements, messages, course_materials)

