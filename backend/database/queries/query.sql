DROP TABLE voters;
DELETE FROM voters;
CREATE TABLE voters (
  voter_id UUID UNIQUE NOT NULL,
  personal_number CHAR(12) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email_address VARCHAR(255) UNIQUE NOT NULL,
  date_of_birth DATE NOT NULL,
  hashed_password VARCHAR(255),
  role VARCHAR(255) NOT NULL DEFAULT 'voter'

  CONSTRAINT chk_personal_number_format CHECK (personal_number ~ '^[0-9]{6}-[0-9]{5}$'),
  CONSTRAINT chk_valid_dob CHECK (date_of_birth < CURRENT_DATE),
  CONSTRAINT chk_valid_email_address CHECK (email_address ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$'),
  CONSTRAINT chk_valid_role CHECK (role IN ('admin', 'voter'))
);
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE OR REPLACE FUNCTION assign_voter_id()
RETURNS TRIGGER AS $$
DECLARE
	new_uuid UUID;
BEGIN
	LOOP
		new_uuid := gen_random_uuid();
		EXIT WHEN NOT EXISTS (SELECT 1 FROM voters WHERE voter_id = new_uuid);
	END LOOP;

	NEW.voter_id = new_uuid;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER ensure_unique_voter_id_inserted 
BEFORE INSERT ON voters
FOR EACH ROW
EXECUTE FUNCTION assign_voter_id();

INSERT INTO voters (personal_number, first_name, last_name, email_address, date_of_birth, hashed_password, role)
VALUES ('328405-78431', 'Mykyta', 'Medvediev', 'mednikita2004@gmail.com', '2004-10-28', '$2a$12$5zB8zXjxM1O.QHwYCaGUkeXnmuGDC/pB9ipoLY7TuonA3qrnj3/YG', 'admin');

INSERT INTO voters (personal_number, first_name, last_name, email_address, date_of_birth, hashed_password, role)
VALUES ('328405-78432', 'Nikita', 'Medvediev', 'mykyta.medvediev@edu.rtu.lv', '2004-10-28', '$2a$12$5zB8zXjxM1O.QHwYCaGUkeXnmuGDC/pB9ipoLY7TuonA3qrnj3/YG', 'voter');

SELECT * FROM voters;

DROP TABLE elections;
CREATE TABLE elections (
	election_id UUID PRIMARY KEY,
	contract_address VARCHAR(42) UNIQUE NOT NULL,
	title VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    created_by VARCHAR(42) NOT NULL,
	end_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- values: active, ended, revealing, finished
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()

	CONSTRAINT chk_status CHECK (status IN ('active', 'ended', 'revealing', 'finished'))
);

CREATE OR REPLACE FUNCTION assign_election_id()
RETURNS TRIGGER AS $$
DECLARE
	new_uuid UUID;
BEGIN
	LOOP
		new_uuid := gen_random_uuid();
		EXIT WHEN NOT EXISTS (SELECT 1 FROM elections WHERE election_id = new_uuid);
	END LOOP;

	NEW.election_id = new_uuid;

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_unique_election_id_inserted 
BEFORE INSERT ON elections
FOR EACH ROW
EXECUTE FUNCTION assign_election_id();

DELETE FROM elections;
DELETE FROM candidates;

SELECT * FROM elections;
SELECT * FROM candidates;

CREATE TABLE candidates (
	candidate_id UUID PRIMARY KEY,
	name VARCHAR(42) NOT NULL,
	party VARCHAR(255) NOT NULL,
    image BYTEA NOT NULL
);

CREATE TABLE election_candidates (
    election_id UUID REFERENCES elections(election_id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    PRIMARY KEY (election_id, candidate_id)
);