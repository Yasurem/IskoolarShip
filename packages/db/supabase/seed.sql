-- Seed Documents
INSERT INTO document_requirements (id, key, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'psa', 'PSA Birth Certificate', 'Official birth certificate from PSA'),
('22222222-2222-2222-2222-222222222222', 'form138', 'Form 138 (Report Card)', 'High school report card'),
('33333333-3333-3333-3333-333333333333', 'itr', 'Income Tax Return', 'Parents ITR or Certificate of Indigency'),
('44444444-4444-4444-4444-444444444444', 'gmrc', 'Certificate of Good Moral', 'Issued by the high school principal or guidance counselor')
ON CONFLICT (key) DO NOTHING;

-- Seed Scholarships
-- 1. DOST-SEI Merit (Strict: STEM, high GPA)
INSERT INTO scholarships (
    id, name, provider, provider_type, source_url, status, 
    estimated_total_value_php, estimated_effort_hours, min_gpa, 
    allowed_strands, preferred_income_bracket
) VALUES (
    '55555555-5555-5555-5555-555555555555', 'DOST-SEI Merit Scholarship', 'Department of Science and Technology', 'government', 'https://sei.dost.gov.ph', 'active',
    40000, 15, 1.25, 
    ARRAY['STEM'], NULL
);

-- Link DOST docs
INSERT INTO scholarship_required_documents (scholarship_id, document_id, is_required) VALUES
('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', true),
('55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', true);

-- 2. Ayala Foundation Grant (Private, low income focus)
INSERT INTO scholarships (
    id, name, provider, provider_type, source_url, status, 
    estimated_total_value_php, estimated_effort_hours, min_gpa, 
    preferred_income_bracket
) VALUES (
    '66666666-6666-6666-6666-666666666666', 'Ayala Foundation Grant', 'Ayala Foundation', 'private', 'https://ayalafoundation.org', 'active',
    50000, 10, 2.0, 
    1 -- Lowest income bracket priority
);

-- Link Ayala Docs
INSERT INTO scholarship_required_documents (scholarship_id, document_id, is_required) VALUES
('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', true);

-- 3. University Alumni Fund (Institutional, highly flexible)
INSERT INTO scholarships (
    id, name, provider, provider_type, source_url, status, 
    estimated_total_value_php, estimated_effort_hours, min_gpa
) VALUES (
    '77777777-7777-7777-7777-777777777777', 'University Alumni Fund', 'University Alumni Association', 'school', 'https://university.edu', 'active',
    30000, 5, 2.5
);

-- Link Alumni Docs
INSERT INTO scholarship_required_documents (scholarship_id, document_id, is_required) VALUES
('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', true);

-- 4. CHED Scholarship Program (Government, Strict GPA, Low Income)
INSERT INTO scholarships (
    id, name, provider, provider_type, source_url, status, 
    estimated_total_value_php, estimated_effort_hours, min_gpa, 
    preferred_income_bracket
) VALUES (
    '88888888-8888-8888-8888-888888888888', 'CHED Scholarship Program', 'Commission on Higher Education', 'government', 'https://ched.gov.ph', 'active',
    60000, 20, 1.5, 
    2
);

-- Link CHED docs
INSERT INTO scholarship_required_documents (scholarship_id, document_id, is_required) VALUES
('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', true),
('88888888-8888-8888-8888-888888888888', '22222222-2222-2222-2222-222222222222', true),
('88888888-8888-8888-8888-888888888888', '33333333-3333-3333-3333-333333333333', true),
('88888888-8888-8888-8888-888888888888', '44444444-4444-4444-4444-444444444444', true);

-- 5. SM Foundation College Scholarship (Private, NCR/Region IVA)
INSERT INTO scholarships (
    id, name, provider, provider_type, source_url, status, 
    estimated_total_value_php, estimated_effort_hours, min_gpa, 
    allowed_regions, allowed_courses, preferred_income_bracket
) VALUES (
    '99999999-9999-9999-9999-999999999999', 'SM Foundation College Scholarship', 'SM Foundation', 'private', 'https://www.sm-foundation.org', 'active',
    80000, 15, 2.0, 
    ARRAY['NCR', 'RegionIVA'], ARRAY['Engineering', 'Computing', 'Business'], 3
);

-- Link SM Docs
INSERT INTO scholarship_required_documents (scholarship_id, document_id, is_required) VALUES
('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', true),
('99999999-9999-9999-9999-999999999999', '33333333-3333-3333-3333-333333333333', true);

-- 6. Tech for Good Women's Grant (NGO, Female, Tech courses)
INSERT INTO scholarships (
    id, name, provider, provider_type, source_url, status, 
    estimated_total_value_php, estimated_effort_hours, min_gpa, 
    allowed_genders, allowed_courses
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Tech for Good Women''s Grant', 'Tech for Good NGO', 'ngo', 'https://techforgood.org', 'active',
    35000, 5, 2.5, 
    ARRAY['Female'], ARRAY['Computing', 'BSCS', 'BSIT', 'BSIS']
);

-- Link Tech Docs
INSERT INTO scholarship_required_documents (scholarship_id, document_id, is_required) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', true);

-- 7. Cebu City LGU Scholar (Government, specific region)
INSERT INTO scholarships (
    id, name, provider, provider_type, source_url, status, 
    estimated_total_value_php, estimated_effort_hours, min_gpa, 
    allowed_regions, allowed_year_levels
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Cebu City LGU Scholar', 'Cebu City Government', 'government', 'https://cebucity.gov.ph', 'active',
    25000, 10, 2.0, 
    ARRAY['RegionVII'], ARRAY['IncomingFreshman']
);

-- Link LGU Docs
INSERT INTO scholarship_required_documents (scholarship_id, document_id, is_required) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', true);
