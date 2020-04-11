<h1 align="center">
  Open Source platform to help volunteers against COVID19
</h1>

Welcome to the Open Source platform to help volunteers, companies and public institutions to organize work against COVID19, and others future disasters.

## Understanding in Brazilian Portuguese (pt-BR)
Esta plataforma nasceu para ajudar o grupo Brothers in Arms (Brasil-RS - Grande Porto Alegre) a organizar o volutariado, empresas e governo, visando combater o COVID19, e futuros desafios semelhantes.

Escolhemos o idioma **inglês** para a codificação, banco de dados e explicações, visando potencializar a contribuição e o uso internacional da plataforma.


# Getting started
This project was written in [Node.js](https://nodejs.org/)</code> technology, using [Express](https://expressjs.com/) as **Back end**, and [Bootstrap](https://getbootstrap.com/) with [Vue.js](https://vuejs.org/) as **Front end**. The [server](server) folder contains the **back end** code, and the [front](front) folder contains the **front end** code.

The **Database** choosed was a SQL type, with [Sequelize](https://sequelize.org/) as the `ORM` and `migrations` library.

Also, this app has a [Command Line Interface](#application-cli-(command-line-tools)), that uses the [Commander.js](https://github.com/tj/commander.js/) library, with the scripts inside the [bin](bin) folder.

## First install and run
1. You need to have [Node.js](https://nodejs.org/) installed 12.16.2+ on your computer with **npm**.
1. Clone the repository.
1. Run `npm install`.
1. Copy the `config.example.json` file to `cfg_development.json` (or `cfg_[env_name].json`).
1. Edit the `cfg_development.json` to have the correct `database` and other configs.
1. Run `npx sequelize db:migrate` to run the `migration scripts`, to create the database tables.
1. Run `./cli.sh admin-create <your-email> <your password>` to create the first admin user.
1. Run `npm run front-build` to Build the front end **SPA** (Single Page Application) files.
1. Run `npm start` to run the server.

... and thats it!

# Help needed
We are a small group, working as volunteers, coding to help it to work. If you want to help more, you can contact us on [#issue12](https://github.com/emilrb/bia-server/issues/12).

# Code organization and standardization
We do not have any strong pattern organization at this moment. Basicaly we have the following rules:
* **database table names** - Will be written on **singular** name, with the prefix of 
* **database relations** for the same module, **don't need** to have the preffix (eg. `gl_user.person_id` = **correct**, `gl_user.gl_person_id` = **wrong!**). Related fields from other modules **need** to have the full name (eg. `or_order.gl_user_id` = **correct**, `or_order.user_id` = **wrong!**).
* **routes, controllers and model names** will follow the same preffix name criteria.
* **front end** routes and filenames will use the same module rules.
* We are using **cameCase** on `database` and `models`, and **under_line.js** on filenames.


## Current application modules 
* **(gl)general** - General module for application, like `gl_user` and `gl_person` table.
* **(sy)system** - System related tables, like `sy_session` and `sy_sequelize_meta`.

# Back end
The backend organization runs a classic **Express** application. The main librarys that are the structure of the server are:
* [Sequelize](https://sequelize.org/) - The ORM library to work with the **database**.
* [Sequelize CLI](https://github.com/sequelize/cli) - The **Sequelize** command line interface to manage `migrations` and others.
* [express-validator](https://express-validator.github.io/) - Validation library for http `query`, `param` and `body` data.
* [validator.js](https://github.com/validatorjs/validator.js) - Base library for the **express-validator**.
* [ejs](https://ejs.co/) - The `html` template builder for `Node.js`.
* [jest](https://jestjs.io/) - The javascript testing library.

## Useful CLI commands
* `npm start` - Runs the sever.
* `npm server-watch` - Runs the server as `nodemon`, watching any file changes and restarting when needed.

## Folders organization
The full back end are inside [server](server) folder, with the following organization inside:
* `bin` - The server run entry point (ex. `node server/bin/www`).
* `controllers` - Files that processes the http requests.
* `database` - Database related files, like `main_connection.js`, `migrations` and `seeders`.
* `helpers` - Utils and quick function files.
* `mails` - Email related files.
* `middlewares` - Safety, error handling, validations and other related files.
* `models` - Database related `ORM` files.
* `public` - Server **public/static** folder. Any file here will be accessible from the web.
* `routes` - The http routes related files.
* `tests` - Server specific backend related **test** files.
* `app.js` - The main **Express** application file.

To understand how the code is pretended to be organized with more details, please read [Code organization](#code-organization-and-standardization).

## Database changes/migrations
Any change to the **database** (table or field creation, indexes, renames etc), need to be done with a `migration` file, inside `database/migrations` folder.

**Migrations concept** are just a way to keep track of any database changes by source-code/script files, time-based sequential and incremental order. If you need to put your `development` or `production` **database** on the same "moment" that other developers are, you just need to run their `migrations` scripts. You can also run on `up` (apply changes) and `down`(rollback changes) sequence.

If you need more info about `migrations`, please read the [Sequelize Migration Manual](https://sequelize.org/v5/manual/migrations.html).

## Sequelize quick help info
Sequelize quick help `command line` tool pasted here:

```bash
$ npx sequelize --help
```
```
npx sequelize [command]

Commands:
  sequelize db:migrate                        Run pending migrations
  sequelize db:migrate:schema:timestamps:add  Update migration table to have timestamps
  sequelize db:migrate:status                 List the status of all migrations
  sequelize db:migrate:undo                   Reverts a migration
  sequelize db:migrate:undo:all               Revert all migrations ran
  sequelize db:seed                           Run specified seeder
  sequelize db:seed:undo                      Deletes data from the database
  sequelize db:seed:all                       Run every seeder
  sequelize db:seed:undo:all                  Deletes data from the database
  sequelize db:create                         Create database specified by configuration
  sequelize db:drop                           Drop database specified by configuration
  sequelize init                              Initializes project
  sequelize init:config                       Initializes configuration
  sequelize init:migrations                   Initializes migrations
  sequelize init:models                       Initializes models
  sequelize init:seeders                      Initializes seeders
  sequelize migration:generate                Generates a new migration file       [aliases: migration:create]
  sequelize model:generate                    Generates a model and its migration  [aliases: model:create]
  sequelize seed:generate                     Generates a new seed file            [aliases: seed:create]

Options:
  --version  Show version number                                         [boolean]
  --help     Show help                                                   [boolean]
```

## Database seeders
In same way as `migrations`, you can create the `seeders` to generate **database** data to better test your code. To do understand more about **seeders concept**, you can read the [Sequelize Migration Manual](https://sequelize.org/v5/manual/migrations.html).

# Front end
The application front end is based on [Bootstrap](https://getbootstrap.com/) framework with [Vue.js](https://vuejs.org/) as `javascript` **SPA** library, and with the [Vuex](https://vuex.vuejs.org/) as state management and routing.

## Useful CLI commands
* `npm front-watch` - Runs the **Vue.js** builder in `development` mode, with the file watcher. If any `front` related file changes, the **Vue CLI** will rebuild it.
* `npm front-build` - Builds the front end **SPA** (Single Page Applications) files for production.

## Understand the front end concepts...
The front end looks like complicated, but it's not. Lets just understand some concepts before we start understanding the **folders**.
* **context** - The application are splitted in different SPA files for each user **context**.
  * **visitor** - Guest or normal website visitor, without login. The *entry point* for that SPA are on that context.
  * **admin** - System administration rules, like users and others stuffs. Thats the admin SPA context.
* **components x libs**
  * **components** - Application specific related front end files.
  * **libs** - *Any application like* reusable components.
* **store** - Application state ([Vuex](https://vuex.vuejs.org/)).
* **resources** - **Model/Table** organized or related files.
* **"`app-`" preffix** - You will se that any included app component will be used with the `app-` preffix, to avoid the chance to conflict with future html tags.

...with that in mind, lets follow for the folders organization.

## Folders and code organization
* `fonts` - Fonts folder.
* `img` - Image related resource files.
* `img/theme` - Theme images.
* `js` - All `javascript` and `vue`.
* `js/bootstrap` - **Vue.js** initial script files. (Do NOT confuse with the [Bootstrap](https://getbootstrap.com/)).
* `js/bootstrap/vue-init.js` - **Vue.js** initialization file. [PLEASE open this file](front/js/bootstrap/vue-init.js) to understand more about the already added components.
* `js/components` - `vue` components, organized by its context.
* `js/components/admin` - **admin** context components.
* `js/components/common` - Common components.
* `js/components/resource` - Crud/table/model related files.
* `js/components/visitor` - **visitor** context components.
* `js/context` - Context specific entry points.
* `js/context/admin` - **admin** context entry point.
* `js/context/admin/App.vue` - Entry point `vue` component for **admin** context.
* `js/context/admin/routes.js` - **admin** **vuex** routes.
* `js/context/visitor` - **visitor** context entry point.
* `js/context/visitor/App.vue` - Entry point `vue` component for **visitor** context.
* `js/context/visitor/routes.js` - **visitor** **vuex** routes.
* `js/libs` - Library reusable *any-application-like* components.
* `js/libs/components` - Vue reusable components.
* `js/libs/components/common` - Common or general components.
* `js/libs/components/crud` - Crud related files, like delete and save buttons.
* `js/libs/components/form` - Form reusable components, like `datetime` inputs.
* `js/libs/components/form/Select2.vue` - Extensible and reusable [Select2](https://select2.org/) `vue` encapsulated component.
* `js/libs/components/item` - Table or list item spans like components to show useful info (like relative datetime value).
* `js/libs/extensions` - Vue reusable extensions.
* `js/libs/mixins` - Vue reusable mixins, like `crud`, `list` and `axios`.
* `sass` - All `css` and `sass` related files.

## Important notes about Select2
Selects with remote data (**Select2**) are a common development facing problem. Please note that the [Select2.vue](front/js/libs/components/form/Select2.vue) in `front/js/libs/components/form/Select2.vue` was made to make it easy to work with.
To understand how it works, you can see the [UserSelect.vue](front/js/components/resources/gl_user/UserSelect.vue) file, in `front/js/components/resources/gl_user/UserSelect.vue`.

### Simple example about using the Select2
Lets just follow the example as using the existing component on a `vue` file:
```javascript
import UserSelect from "../.../UserSelect.vue";
export default {
    ...
    components: {
        'app-user-select': UserSelect,
    },
    data() {
        return {
            user: null,
        };
    }
    ...
}
```
```html
<div>
    <app-user-select v-model="user"></app-user-select>
</div>
```
It will result in a...
<br />
`HTTP GET /api/admin/gl_user?q=[your_query_text]`

And the result will be parse by the [UserSelect.vue](front/js/components/resources/gl_user/UserSelect.vue) => `mapResult` function:
```javascript
export default {
    ...
    methods: {
        mapResult(value, index) {
            value.text = `${value.name} - (${value.email})`;
            return value;
        }
  }
  ...
}
```
### Using Select2 with "extraparams" in the GET request
Another example, now with extraparams. Lets filter the `users` by `level`.
```javascript
import UserSelect from "../.../UserSelect.vue";
export default {
    ...
    components: {
        'app-user-select': UserSelect,
    },
    data() {
        return {
            user: null,
            level: 1, // admin - check this with attention
        };
    }
    ...
}
```
```html
<div>
    <!-- watch for the extraparams object with the level -->
    <app-user-select v-model="user" :extraparams="{ level: level }"></app-user-select>
</div>
```
It will send the `&level=level` param on the request...
<br />
`HTTP GET /api/admin/gl_user?q=[query_text]`**`&level=1`**


# Application CLI (Command line tools)
The command line tools for the application are inside the [bin](bin) folder. All the commands will be documented better later... For now you can use `./cli.sh --help`:
```
Usage: app [options] [command]

Options:
  -V, --version  output the version number
  -h, --help     output usage information

Commands:
  admin-create   Creates database and setup first admin user.
  connect-test   Tests database connection.
  help           Show this help
  help [cmd]     display help for [cmd]
  ```

# Thank you
We want to thank you for your attention to read the entire `README.md` file.
If you want to help, [let us know](https://github.com/emilrb/bia-server/issues/12).