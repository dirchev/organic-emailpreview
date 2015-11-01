# organic-emailpreview v0.0.3

A simple email sender with jade and i18next templates.

## DNA

```js
{
  reactOn: String    // default "sendEmail"
  from: String       // default email address
  to: String         // default email address
  root: String       // [required] path, containing the email templates
  port: String       // port for the express server, default 3212
}
```

## Reaction

With chemical:

```js
{
  to: String                // if config.toEmailAddress is not set
  from: String              // if config.fromEmailAddress is not set
  template: String          // the name of the folder, where the template is located
  locale: String            //
  subject: String            //
  sendMailOptions: Object   //
  data: Object              //
}
```

* Loads a jade template by `config.root`+ `template` + (optionally -`locale`) + .jade path
* renders the template with `data`

## `template` property

  * can be a path to jade template file
  * can be a path to directory, rendering final template html will be via [email-templates](https://github.com/niftylettuce/node-email-templates)
