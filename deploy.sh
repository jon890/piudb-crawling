gcloud functions deploy piudb-crawling \
--project=piudb-393301 \
--gen2 \
--runtime=nodejs20 \
--region=asia-northeast1 \
--source=. \
--entry-point=crawling \
--trigger-http \
--allow-unauthenticated