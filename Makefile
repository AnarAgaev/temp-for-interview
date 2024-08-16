destroy:
	docker compose down --volumes --remove-orphans

build-node:
	@make destroy
	docker compose build node
	docker compose run --rm --entrypoint "sh /app/docker/entrypoint.node.production.sh" node
