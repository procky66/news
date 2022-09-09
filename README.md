# News API

## Description

This an API for the purpose of accessing news data programmatically.  
The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

## Hosted

The app is hosted on Heroku:   https://news-app-nc-69.herokuapp.com/

## Local deployment
The app may be cloned to a local folder:
```python
git clone https://github.com/procky66/news.git
```

Dependencies are installed with:
```python
npm install
```

The databases are created with:
```python
npm run setup-dbs
```

In order to run this API locally, two .env files need to be created:

**.env.test** with the line:

```python
PGDATABASE=nc_news_test
```

**.env.development** with the line:

```python
PGDATABASE=nc_news
```

The development database may be seeded using:
```python
npm run seed
```

The test database does not need to be seeded as this will be done automatically when the tests are run with:
```python
npm run test
```

Minimum version of node required: v18.5.0  
Minimum version of psql required: 14.5