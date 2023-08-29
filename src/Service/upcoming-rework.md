# REWORKED IDEA
> login -> fetch current user's data in (db:userData) -> lookup for username in user registrar -> check user record ("matchcase: username, db:profiles") -> if (exists) then do nothing -> otherwise generate a randomised personal username and store that into (db: userData) 
# DB REWORKED INFRASTRUCTURE
> userData (id: doc.uid's directly from the firebase)
> profiles (id: generated username presented in the db:userData document)


# MIGRATE TO SUPABASE
