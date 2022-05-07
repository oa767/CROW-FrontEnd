node_modules: 
		npm install

run: node_modules
		npm run start

server:
		cd Server && npm run pushToHeroku
