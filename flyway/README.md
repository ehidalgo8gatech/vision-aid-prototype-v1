To test flyway locally run ./gradlew clean build

To run flyway against real db run ./gradlew bootRun

Version should only be one line since there is no commit rollback feature in flyway when not using postgress.
If you have wrong db command please manually delete the wrong data and then delete the version line. 
Then fix the sql version and run again. 