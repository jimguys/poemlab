Poem Lab
========
Collaborative Poetry Engine

[![Code Climate](https://codeclimate.com/github/jimguys/poemlab.png)](https://codeclimate.com/github/jimguys/poemlab)

### Installation

Poemlab can be deployed into a dokku environment.

1. Set up a dokku environment.
To set up a local dokku environment on vagrant, follow these instructions: http://dokku.viewdocs.io/dokku/getting-started/install/vagrant/. This will set up a local host entry, dokku.me, that refers to the dokku environment within vagrant.

For a publicaly accessible installation, digital ocean provides a dokku droplet template.

2. Dokku plugin installation.
ssh into the machine running the dokku environment as a sudoer (not as the dokku user), and perform the dokku plugin installation:

  ```
  sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git
  sudo dokku plugin:install https://github.com/dokku/dokku-redis.git
  sudo dokku plugin:install https://github.com/jessearmand/dokku-logging-supervisord.git
  ```
Disconnect from the ssh session.

3. Install and configure over ssh using the dokku user. Replace dokku.me with the production host if necessary.
  ```
  ssh dokku@dokku.me apps:create poemlab
  ssh dokku@dokku.me postgres:create poemlab
  ssh dokku@dokku.me postgres:link poemlab poemlab
  ssh dokku@dokku.me redis:create poemlab
  ssh dokku@dokku.me redis:link poemlab poemlab
  ```
Configure the key for the session server. Change the secret key to something else.
  ```
  ssh dokku@dokku.me config:set poemlab SESSION_KEY="secret\ key"
  ```

4. Create the database schema.
  ```
  ssh dokku@dokku.me postgres:connect poemlab < db/schema.sql
  ```

5. Verify the configuration.
  ```
  ssh dokku@dokku.me config poemlab
  ```
You should see these environment variables, although the values will differ:
  ```
  DATABASE_URL:   postgres://postgres:a0270cb512048b56cba8464b09fa7782@dokku-postgres-poemlab:5432/poemlab
  REDIS_URL:      redis://dokku-redis-poemlab:6379/0
  SESSION_KEY:    secret key
  ```

### Deployment

1. Add a git remote to the dokku environment.

  ```
  git remote add dokku-local dokku@dokku.me:poemlab
  ```

Alternatively, add a remote to a production dokku environment.

2. Push to the remote

  ```
  git push dokku-local master
  ```

3. Verify the application is running at ```http://poemlab.dokku.me```, or in the production environment if that is where you pushed.

### Development with Vagrant

(WORKING ON THIS)

Having to push to dokku every time a change needs to be made is a slow feedback loop for local development. To set up a development environment for local development, run this in the root directory of the project:

  ```vagrant up```

You should then be able to access the application at ```http://localhost:8088```. Modifying the code should automatically relaunch the application.


### Development without Vagrant

Alternatively, you can set up postgres and redis on your local machine instead of using vagrant, export the ```DATABASE_URL```, ```REDIS_URL```, and ```PORT``` environment variables, then run the following:

  ```
  npm install
  node app.js
  ```
