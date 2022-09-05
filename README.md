# News API

## Description

This an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

In order to run this API locally, two .env files need to be created:

**.env.test** with the line:

```python
PGDATABASE=nc_news_test
```

**.env.development** with the line:

```python
PGDATABASE=nc_news
```
