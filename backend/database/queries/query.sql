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