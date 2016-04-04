Poem Lab
========
Collaborative Poetry Engine

[![Code Climate](https://codeclimate.com/github/jimguys/poemlab.png)](https://codeclimate.com/github/jimguys/poemlab)

### Installation

Poemlab can be deployed into a dokku environment.

1. Set up a dokku environment. To set up a local dokku environment on vagrant, follow these instructions: http://dokku.viewdocs.io/dokku/getting-started/install/vagrant/. This will set up a local host entry, dokku.me, that refers to the dokku environment within vagrant. For a publicly accessible installation, digital ocean provides a dokku droplet template.

2. Install dokku plugins. ssh into the machine running the dokku environment as a sudoer (not as the dokku user), and perform the dokku plugin installation:

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
  You should see these environment variables, although the values may differ:
  ```
  DATABASE_URL:   postgres://postgres:<password>@dokku-postgres-poemlab:5432/poemlab
  REDIS_URL:      redis://dokku-redis-poemlab:6379/0
  SESSION_KEY:    secret key
  ```

### Deployment
Dokku will build and deploy the application when the code is pushed via git.

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

### Development
Deploying to dokku each time a change is made is a slow feedback loop for development. For a faster feedback loop, set up the application on your machine and run it outside of dokku. You can set up the databases on your machine as well, but you may find it easier to use your local dokku environment to host the storage resources for development purposes.

  1. First expose the ports from dokku. Pick ports that do not conflict with other ports you may have exposed on the vagrant vm:
  ```
  ssh dokku@dokku.me postgres:expose poemlab 54320
  ssh dokku@dokku.me redis:expose poemlab 63790
  ```

  2. Next, forward these ports through your vagrant provider (e.g. VirtualBox). There are two levels of port-forwarding happening here: the databases expose a port which is then exposed from the docker container and made accessible to the vagrant provider, then the vagrant provider forwards ports to make them accessible to your host machine. In these instructions, the ports are forwarded as follows:
  ```
    5432 (docker) -> 54320 (vagrant) -> 54321 (host)
    6379 (docker) -> 63790 (vagrant) -> 63791 (host)
  ```
  You don't have to use different port numbers for each layer, you just have to ensure that there are no conflicts between other port assignments.

  3. Export environment variables, using the ports you forwarded through your vagrant provider.
  ```
  export DATABASE_URL=postgres://postgres:<password>@dokku.me:54321/poemlab
  export REDIS_URL=redis://dokku.me:63791/0
  export SESSION_KEY="secret key"
  ```  

  4. You should now be able to run the project:
  ```
  npm install -g supervisor
  npm install
  npm run dev
  ```

  5. It should now be accessible at ```http://localhost:8088```. The application should restart when file changes are detected.
