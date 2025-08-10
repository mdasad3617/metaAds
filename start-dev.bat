@echo off
echo Starting Meta Ads AI Generator...
echo.

echo Checking if PostgreSQL is needed...
echo If you don't have PostgreSQL set up yet, you can:
echo 1. Install PostgreSQL locally
echo 2. Use Docker: docker run --name meta-ads-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=meta_ads_ai -p 5432:5432 -d postgres:15
echo 3. Use a cloud database (Supabase, Railway, etc.)
echo.

echo Starting development servers...
cd server
npm run dev