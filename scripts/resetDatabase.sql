PRAGMA foreign_keys = OFF;

BEGIN TRANSACTION;

-- =====================================
-- DATI CLINICI
-- =====================================

DELETE FROM referti;
DELETE FROM moduli_firmati;
DELETE FROM documenti;
DELETE FROM prestazioni;
DELETE FROM appuntamenti;
DELETE FROM prenotazioni;
DELETE FROM cartelle_cliniche;

-- =====================================
-- PAZIENTI
-- =====================================

DELETE FROM pazienti;

-- =====================================
-- LOG
-- =====================================

DELETE FROM audit_log;

-- Se presenti
DELETE FROM email_log;
DELETE FROM campagne_log;
DELETE FROM notifiche;

-- =====================================
-- AZZERA GLI AUTOINCREMENT
-- =====================================

DELETE FROM sqlite_sequence
WHERE name IN (
    'pazienti',
    'cartelle_cliniche',
    'prestazioni',
    'prenotazioni',
    'appuntamenti',
    'referti',
    'moduli_firmati',
    'documenti',
    'audit_log',
    'email_log',
    'campagne_log',
    'notifiche'
);

COMMIT;

PRAGMA foreign_keys = ON;