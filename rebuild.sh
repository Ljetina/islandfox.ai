DOCKER_BUILDKIT=1 docker build --secret id=chatgpt,src=.env.local -t inslandfox-ui .
# docker run --env-file .env.local -p 1337:3000 chatgpt-ui