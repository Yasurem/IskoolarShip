-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Scholarships Table
CREATE TABLE scholarships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_type TEXT NOT NULL,
    description TEXT,
    source_url TEXT NOT NULL,
    application_url TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    last_verified_at TIMESTAMPTZ,
    academic_year TEXT,
    benefit_summary TEXT,
    estimated_total_value_php NUMERIC NOT NULL,
    application_open_date TIMESTAMPTZ,
    deadline TIMESTAMPTZ,
    min_gpa NUMERIC,
    allowed_genders TEXT[],
    allowed_strands TEXT[],
    allowed_courses TEXT[],
    allowed_year_levels TEXT[],
    allowed_regions TEXT[],
    preferred_regions TEXT[],
    preferred_income_bracket INTEGER,
    preferred_courses TEXT[],
    estimated_effort_hours INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document Requirements Dictionary
CREATE TABLE document_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scholarship to Document Requirements Many-to-Many Link
CREATE TABLE scholarship_required_documents (
    scholarship_id UUID REFERENCES scholarships(id) ON DELETE CASCADE,
    document_id UUID REFERENCES document_requirements(id) ON DELETE CASCADE,
    is_required BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    PRIMARY KEY (scholarship_id, document_id)
);

-- Row Level Security (Public Read-Only)
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarship_required_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to scholarships" ON scholarships FOR SELECT USING (true);
CREATE POLICY "Allow public read access to document_requirements" ON document_requirements FOR SELECT USING (true);
CREATE POLICY "Allow public read access to scholarship_required_documents" ON scholarship_required_documents FOR SELECT USING (true);
