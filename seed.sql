-- CivicPro Database Seed File
-- This file contains the exact data for seeding the CivicPro political accountability platform

-- Clear existing data in proper order (respecting foreign key constraints)
DELETE FROM admin_log;
DELETE FROM ratings;
DELETE FROM voting_records;
DELETE FROM promises;
DELETE FROM bills;
DELETE FROM politicians;
DELETE FROM users;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE politicians_id_seq RESTART WITH 1;
ALTER SEQUENCE promises_id_seq RESTART WITH 1;
ALTER SEQUENCE bills_id_seq RESTART WITH 1;
ALTER SEQUENCE voting_records_id_seq RESTART WITH 1;
ALTER SEQUENCE ratings_id_seq RESTART WITH 1;
ALTER SEQUENCE admin_log_id_seq RESTART WITH 1;

-- Insert admin user
INSERT INTO users (username, password, is_admin, created_at) VALUES
('admin', 'admin123', true, NOW());

-- Insert politicians (Guernsey parishes)
INSERT INTO politicians (name, party, parish, number_of_votes, status, bio, first_elected, profile_image_url, manifesto_point_1, manifesto_point_2, manifesto_point_3, manifesto_point_4, manifesto_point_5, created_at, updated_at) VALUES
('Jane Smith', 'Democratic', 'St. Peter Port', 15420, 'Current', 'Jane Smith is a Democratic member representing St. Peter Port parish. She was first elected in 2018 and has focused her legislative efforts on environmental protection, healthcare reform, and economic equality.', '2018-11-06', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150', 'Expand renewable energy investments by 25%', 'Increase minimum wage to £12 per hour', 'Expand healthcare coverage to all residents', 'Reform education funding system', 'Support local business development', NOW(), NOW()),

('John Doe', 'Republican', 'St. Sampson', 12380, 'Current', 'John Doe is a Republican member representing St. Sampson parish. He focuses on defense, economic growth, and fiscal responsibility.', '2016-11-08', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150', 'Strengthen border security measures', 'Provide tax cuts for small businesses', 'Increase defense spending by 15%', 'Reduce government regulations', 'Support traditional family values', NOW(), NOW()),

('Maria Rodriguez', 'Independent', 'Vale', 9750, 'Current', 'Maria Rodriguez is an Independent member representing Vale parish. She advocates for education reform, environmental policies, and social justice.', '2020-11-03', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150', 'Reform education system and teacher pay', 'Implement comprehensive environmental policies', 'Ensure social justice and equality', 'Support community development programs', 'Promote transparency in government', NOW(), NOW()),

('Robert Johnson', 'Democratic', 'St. Martin', 11200, 'Current', 'Robert Johnson is a Democratic member representing St. Martin parish. He focuses on urban development, healthcare access, and education.', '2018-11-06', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150', 'Improve public transportation system', 'Expand healthcare access programs', 'Increase education funding by 20%', 'Support affordable housing initiatives', 'Promote economic development', NOW(), NOW()),

('Sarah Williams', 'Republican', 'Forest', 8950, 'Current', 'Sarah Williams is a Republican member representing Forest parish. She advocates for small business, economic growth, and community development.', '2020-11-03', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150', 'Support small business development', 'Reduce business taxes and regulations', 'Improve infrastructure and roads', 'Strengthen community safety programs', 'Promote tourism and heritage', NOW(), NOW()),

('David Thompson', 'Independent', 'St. Saviour', 7850, 'Current', 'David Thompson is an Independent member representing St. Saviour parish. He focuses on agricultural policy, rural development, and environmental conservation.', '2022-05-15', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150', 'Support local farming and agriculture', 'Protect rural landscapes and heritage', 'Develop sustainable tourism', 'Improve rural broadband connectivity', 'Enhance environmental conservation', NOW(), NOW());

-- Insert promises
INSERT INTO promises (politician_id, title, description, status, fulfillment_date, created_at, updated_at) VALUES
-- Jane Smith's promises
(1, 'Expand renewable energy investments', 'Promised to increase government funding for renewable energy research by 25% and successfully voted for the Clean Energy Act of 2022.', 'Fulfilled', '2022-03-15', NOW(), NOW()),
(1, 'Increase minimum wage', 'Promised to support minimum wage increases and voted for the Fair Wage Act of 2021.', 'Fulfilled', '2021-07-20', NOW(), NOW()),
(1, 'Expand healthcare coverage', 'Promised to work on healthcare reform to cover more residents. Bill still pending in committee.', 'InProgress', NULL, NOW(), NOW()),
(1, 'Reform education funding', 'Promised to increase education funding by 20% and improve teacher salaries.', 'InProgress', NULL, NOW(), NOW()),

-- John Doe's promises
(2, 'Strengthen border security', 'Promised to increase funding for border patrol and security infrastructure.', 'Fulfilled', '2021-06-10', NOW(), NOW()),
(2, 'Tax cuts for small businesses', 'Promised tax relief for small businesses affected by economic challenges.', 'InProgress', NULL, NOW(), NOW()),
(2, 'Increase defense spending', 'Promised to increase defense budget by 15% for national security.', 'Fulfilled', '2022-08-20', NOW(), NOW()),

-- Maria Rodriguez's promises
(3, 'Education system reform', 'Promised comprehensive education reform including teacher pay increases and curriculum updates.', 'InProgress', NULL, NOW(), NOW()),
(3, 'Environmental protection policies', 'Promised to implement strict environmental protection measures and carbon reduction targets.', 'InProgress', NULL, NOW(), NOW()),
(3, 'Social justice initiatives', 'Promised to work on equality measures and social justice programs.', 'Fulfilled', '2023-01-15', NOW(), NOW()),

-- Robert Johnson's promises
(4, 'Public transportation improvement', 'Promised to expand and improve public transportation systems across the parish.', 'InProgress', NULL, NOW(), NOW()),
(4, 'Healthcare access expansion', 'Promised to expand healthcare access programs for underserved communities.', 'Fulfilled', '2023-05-10', NOW(), NOW()),

-- Sarah Williams's promises
(5, 'Small business support', 'Promised to create programs supporting small business development and growth.', 'InProgress', NULL, NOW(), NOW()),
(5, 'Infrastructure improvements', 'Promised to improve roads and infrastructure throughout the parish.', 'Fulfilled', '2023-09-30', NOW(), NOW()),

-- David Thompson's promises
(6, 'Agricultural support programs', 'Promised to create support programs for local farmers and agricultural development.', 'InProgress', NULL, NOW(), NOW()),
(6, 'Rural broadband expansion', 'Promised to improve broadband connectivity in rural areas.', 'Fulfilled', '2023-06-25', NOW(), NOW());

-- Insert bills
INSERT INTO bills (title, description, date_voted, created_at) VALUES
('Climate Protection Act', 'A bill to fund renewable energy research and limit carbon emissions across Guernsey.', '2023-06-12', NOW()),
('Infrastructure Funding Bill', 'A bill to fund infrastructure projects and road improvements across all parishes.', '2023-05-28', NOW()),
('Defense Spending Increase', 'A bill to increase the defense and security budget by 10%.', '2023-05-15', NOW()),
('Education Funding Act', 'A bill to increase funding for public education and teacher salaries by 20%.', '2023-04-23', NOW()),
('Healthcare Access Bill', 'A bill to expand healthcare access and services for all residents.', '2023-07-10', NOW()),
('Small Business Support Act', 'A bill to provide tax incentives and support for small businesses.', '2023-08-15', NOW()),
('Environmental Conservation Bill', 'A bill to protect natural areas and implement conservation measures.', '2023-09-05', NOW()),
('Rural Development Act', 'A bill to support rural development and agricultural initiatives.', '2023-10-20', NOW());

-- Insert voting records
INSERT INTO voting_records (politician_id, bill_id, vote, created_at) VALUES
-- Jane Smith's votes (ID: 1)
(1, 1, 'For', NOW()),    -- Climate Protection Act
(1, 2, 'For', NOW()),    -- Infrastructure Funding Bill
(1, 3, 'Against', NOW()), -- Defense Spending Increase
(1, 4, 'For', NOW()),    -- Education Funding Act
(1, 5, 'For', NOW()),    -- Healthcare Access Bill
(1, 6, 'For', NOW()),    -- Small Business Support Act
(1, 7, 'For', NOW()),    -- Environmental Conservation Bill
(1, 8, 'For', NOW()),    -- Rural Development Act

-- John Doe's votes (ID: 2)
(2, 1, 'Against', NOW()), -- Climate Protection Act
(2, 2, 'For', NOW()),    -- Infrastructure Funding Bill
(2, 3, 'For', NOW()),    -- Defense Spending Increase
(2, 4, 'For', NOW()),    -- Education Funding Act
(2, 5, 'Against', NOW()), -- Healthcare Access Bill
(2, 6, 'For', NOW()),    -- Small Business Support Act
(2, 7, 'Against', NOW()), -- Environmental Conservation Bill
(2, 8, 'For', NOW()),    -- Rural Development Act

-- Maria Rodriguez's votes (ID: 3)
(3, 1, 'For', NOW()),    -- Climate Protection Act
(3, 2, 'For', NOW()),    -- Infrastructure Funding Bill
(3, 3, 'Against', NOW()), -- Defense Spending Increase
(3, 4, 'For', NOW()),    -- Education Funding Act
(3, 5, 'For', NOW()),    -- Healthcare Access Bill
(3, 6, 'For', NOW()),    -- Small Business Support Act
(3, 7, 'For', NOW()),    -- Environmental Conservation Bill
(3, 8, 'For', NOW()),    -- Rural Development Act

-- Robert Johnson's votes (ID: 4)
(4, 1, 'For', NOW()),    -- Climate Protection Act
(4, 2, 'For', NOW()),    -- Infrastructure Funding Bill
(4, 3, 'Abstained', NOW()), -- Defense Spending Increase
(4, 4, 'For', NOW()),    -- Education Funding Act
(4, 5, 'For', NOW()),    -- Healthcare Access Bill
(4, 6, 'For', NOW()),    -- Small Business Support Act
(4, 7, 'For', NOW()),    -- Environmental Conservation Bill
(4, 8, 'For', NOW()),    -- Rural Development Act

-- Sarah Williams's votes (ID: 5)
(5, 1, 'Against', NOW()), -- Climate Protection Act
(5, 2, 'For', NOW()),    -- Infrastructure Funding Bill
(5, 3, 'For', NOW()),    -- Defense Spending Increase
(5, 4, 'For', NOW()),    -- Education Funding Act
(5, 5, 'Against', NOW()), -- Healthcare Access Bill
(5, 6, 'For', NOW()),    -- Small Business Support Act
(5, 7, 'Against', NOW()), -- Environmental Conservation Bill
(5, 8, 'For', NOW()),    -- Rural Development Act

-- David Thompson's votes (ID: 6)
(6, 1, 'For', NOW()),    -- Climate Protection Act
(6, 2, 'For', NOW()),    -- Infrastructure Funding Bill
(6, 3, 'Abstained', NOW()), -- Defense Spending Increase
(6, 4, 'For', NOW()),    -- Education Funding Act
(6, 5, 'For', NOW()),    -- Healthcare Access Bill
(6, 6, 'For', NOW()),    -- Small Business Support Act
(6, 7, 'For', NOW()),    -- Environmental Conservation Bill
(6, 8, 'For', NOW()),    -- Rural Development Act

-- Insert citizen ratings and comments
INSERT INTO ratings (politician_id, user_id, rating, comment, status, created_at) VALUES
-- Ratings for Jane Smith (ID: 1)
(1, 'citizen_001', 4.5, 'Jane has done excellent work on environmental issues and healthcare. She keeps her promises and communicates well with constituents.', 'Approved', NOW()),
(1, 'citizen_002', 4.0, 'Good representation for St. Peter Port. Would like to see more progress on education funding.', 'Approved', NOW()),
(1, 'citizen_003', 5.0, 'Outstanding work on renewable energy. She delivered exactly what she promised during the campaign.', 'Approved', NOW()),
(1, 'citizen_004', 3.5, 'Generally positive but some policies could be more fiscally responsible.', 'Approved', NOW()),

-- Ratings for John Doe (ID: 2)
(2, 'citizen_005', 3.5, 'John is strong on defense and business issues but his environmental stance is concerning.', 'Approved', NOW()),
(2, 'citizen_006', 4.0, 'Good fiscal conservative. Delivered on his business tax promises.', 'Approved', NOW()),
(2, 'citizen_007', 2.5, 'Disappointed with his votes against healthcare and environmental bills.', 'Approved', NOW()),
(2, 'citizen_008', 4.5, 'Excellent work supporting small businesses during tough economic times.', 'Approved', NOW()),

-- Ratings for Maria Rodriguez (ID: 3)
(3, 'citizen_009', 4.8, 'Maria brings fresh perspective and truly represents independent values. Great work on social justice.', 'Approved', NOW()),
(3, 'citizen_010', 4.0, 'Appreciating her balanced approach and focus on education reform.', 'Approved', NOW()),
(3, 'citizen_011', 5.0, 'Best politician we have had in Vale. Accessible and committed to her constituents.', 'Approved', NOW()),

-- Ratings for Robert Johnson (ID: 4)
(4, 'citizen_012', 4.2, 'Robert has done good work on healthcare access. Public transportation improvements are much needed.', 'Approved', NOW()),
(4, 'citizen_013', 3.8, 'Solid representation but would like to see more action on education promises.', 'Approved', NOW()),
(4, 'citizen_014', 4.5, 'Very responsive to constituent concerns and follows through on commitments.', 'Approved', NOW()),

-- Ratings for Sarah Williams (ID: 5)
(5, 'citizen_015', 3.8, 'Good work on infrastructure but disappointed with healthcare votes.', 'Approved', NOW()),
(5, 'citizen_016', 4.2, 'Excellent support for small businesses in Forest parish.', 'Approved', NOW()),
(5, 'citizen_017', 3.0, 'Mixed feelings about her environmental positions.', 'Approved', NOW()),

-- Ratings for David Thompson (ID: 6)
(6, 'citizen_018', 4.7, 'David truly understands rural issues and agricultural needs. Great work on broadband expansion.', 'Approved', NOW()),
(6, 'citizen_019', 4.3, 'Excellent advocate for farmers and rural communities.', 'Approved', NOW()),
(6, 'citizen_020', 4.0, 'Good balanced approach to development and conservation.', 'Approved', NOW()),

-- Some pending ratings for moderation
(1, 'citizen_021', 2.0, 'This politician is terrible and corrupt!', 'Pending', NOW()),
(2, 'citizen_022', 1.0, 'Complete waste of taxpayer money', 'Pending', NOW()),
(3, 'citizen_023', 5.0, 'Amazing work on everything!', 'Pending', NOW());

-- Insert admin log entries
INSERT INTO admin_log (user_id, action, details, created_at) VALUES
(1, 'Login', '{"ip": "192.168.1.1", "userAgent": "Mozilla/5.0"}', NOW()),
(1, 'Create Politician', '{"politicianId": 1, "name": "Jane Smith", "parish": "St. Peter Port"}', NOW()),
(1, 'Update Promise', '{"promiseId": 1, "oldStatus": "InProgress", "newStatus": "Fulfilled"}', NOW()),
(1, 'Approve Rating', '{"ratingId": 1, "politicianId": 1, "action": "approved"}', NOW()),
(1, 'Create Bill', '{"billId": 1, "title": "Climate Protection Act"}', NOW()),
(1, 'Moderate Comment', '{"ratingId": 21, "action": "flagged_for_review", "reason": "inappropriate_language"}', NOW());

-- Verify data insertion
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Politicians', COUNT(*) FROM politicians  
UNION ALL
SELECT 'Promises', COUNT(*) FROM promises
UNION ALL  
SELECT 'Bills', COUNT(*) FROM bills
UNION ALL
SELECT 'Voting Records', COUNT(*) FROM voting_records
UNION ALL
SELECT 'Ratings', COUNT(*) FROM ratings
UNION ALL
SELECT 'Admin Log', COUNT(*) FROM admin_log;