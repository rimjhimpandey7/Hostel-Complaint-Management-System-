-- Hostel Complaint Management System Sample Seed Data
-- Standard password for all seed accounts is: password123
-- Pre-hashed bcrypt hash: $2a$10$wT3yJ9B4W1n6XbV3w7C9OuqXhN7jM5kE8R3T6Y9U2I5O8P1A4S7D2 (bcrypt hash for password123)

INSERT INTO users (name, email, phone, student_id, room_number, hostel_block, password, role) VALUES
('Hostel Warden (Admin)', 'warden@hostel.com', '+91 9876543210', NULL, NULL, NULL, '$2a$10$eE.lD1t8Qk3J1P9V3M2b1eQxW4K5L6M7N8O9P0Q1R2S3T4U5V6W7X', 'admin'),
('Priya Sharma', 'priya.sharma@student.com', '+91 9812345678', 'STU-2024-001', 'KC-204', 'Kalpana Chawla Girls Hostel', '$2a$10$eE.lD1t8Qk3J1P9V3M2b1eQxW4K5L6M7N8O9P0Q1R2S3T4U5V6W7X', 'student'),
('Ananya Patel', 'ananya.patel@student.com', '+91 9823456789', 'STU-2024-002', 'H-108', 'Himalaya Girls Hostel', '$2a$10$eE.lD1t8Qk3J1P9V3M2b1eQxW4K5L6M7N8O9P0Q1R2S3T4U5V6W7X', 'student'),
('Sneha Kaur', 'sneha.kaur@student.com', '+91 9834567890', 'STU-2024-003', 'MG-312', 'Mata Gujri Girls Hostel', '$2a$10$eE.lD1t8Qk3J1P9V3M2b1eQxW4K5L6M7N8O9P0Q1R2S3T4U5V6W7X', 'student');

-- Sample Complaints
INSERT INTO complaints (complaint_id, user_id, title, category, description, room_number, priority, status, assigned_to, admin_remarks, created_at, resolved_at) VALUES
('CMP-20260901-1001', 2, 'Ceiling Fan Making Loud Noise', 'Electrical', 'The ceiling fan in room B-204 is making an unbearable squeaking and grinding noise when running on medium or high speed.', 'B-204', 'Medium', 'Pending', NULL, NULL, NOW() - INTERVAL '3 days', NULL),

('CMP-20260902-1002', 3, 'High Voltage Fluctuations & Socket Damage', 'Electrical', 'Power socket near study table sparking and high voltage fluctuation in room A-108.', 'A-108', 'Emergency', 'In Progress', 'Electrician Dept - Ramesh Kumar', 'Electrician dispatched on priority. Spare parts ordered.', NOW() - INTERVAL '2 days', NULL),

('CMP-20260902-1003', 4, 'Bathroom Tap Leaking Continuously', 'Plumbing', 'Main washroom tap leaking heavily causing water wastage in C-312.', 'C-312', 'High', 'Assigned', 'Plumbing Dept - Suresh Waterworks', 'Assigned to head plumber. Scheduled for repair today.', NOW() - INTERVAL '2 days', NULL),

('CMP-20260903-1004', 2, 'Wi-Fi Connection Intermittent on 3rd Floor', 'Wi-Fi/Internet', 'Frequent disconnection and no internet access from 8 PM to 11 PM on block B router 4.', 'B-204', 'Low', 'Resolved', 'IT Helpdesk - NetCom Services', 'Router reset and firmware updated. Signal restored.', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day'),

('CMP-20260904-1005', 3, 'Study Table Chair Armrest Broken', 'Furniture', 'The wooden study chair has a broken armrest and sharp loose nails.', 'A-108', 'Low', 'Pending', NULL, NULL, NOW() - INTERVAL '5 hours', NULL);

-- Sample Complaint Updates / Timeline History
INSERT INTO complaint_updates (complaint_id, status, remarks, updated_by, created_at) VALUES
(1, 'Pending', 'Complaint submitted by student.', 2, NOW() - INTERVAL '3 days'),
(2, 'Pending', 'Emergency complaint logged.', 3, NOW() - INTERVAL '2 days'),
(2, 'In Progress', 'Electrician dispatched on priority.', 1, NOW() - INTERVAL '1 day'),
(3, 'Pending', 'Plumbing issue reported.', 4, NOW() - INTERVAL '2 days'),
(3, 'Assigned', 'Assigned to head plumber Suresh Waterworks.', 1, NOW() - INTERVAL '1 day'),
(4, 'Pending', 'Wi-Fi ticket opened.', 2, NOW() - INTERVAL '4 days'),
(4, 'In Progress', 'IT Helpdesk investigating router firmware.', 1, NOW() - INTERVAL '2 days'),
(4, 'Resolved', 'Router reset and firmware updated. Signal restored.', 1, NOW() - INTERVAL '1 day'),
(5, 'Pending', 'Furniture complaint submitted.', 3, NOW() - INTERVAL '5 hours');
