# l5-repository

## 主要作用

配合 laravel 的第三方库 [http://andersonandra.de/l5-repository/](http://andersonandra.de/l5-repository) 一起使用，后端应先添加`RequestCriteria`。

```php
$this->pushCriteria(app('Prettus\Repository\Criteria\RequestCriteria'));
```

## 安装

```bash
npm install l5-repository
```

## 用法

链式调用拼接查询条件、排序、过滤字段等。

```js
import L5Repository from 'l5-repository';

const l5Repository = new L5Repository();
const query = l5Repository
  .where('name', 'like', 'hachi')
  .where([
    ['status', 1],
    ['country', '=', 'japan']
  ])
  .orderBy('name')
  .orderByDesc('country')
  .with('author')
  .filter(['name', 'status', 'country'])
  .searchJoin('or');
```

最后会提供2个方法 `toPairs` 和 `toString`，将上面的调用转换为键值对格式或者query字符串格式。

`query.toString()` 结果为：
```
search=name:hachi;status:1;country:japan&searchFields=name:like;status:=;country:=&orderBy=name;country&sortedBy=asc;desc&with=author&filter=name;status;country&searchJoin=or
```

`query.toPairs()` 结果为：

```js
{
  search: 'name:hachi;status:1;country:japan',
  searchFields: 'name:like;status:=;country:=',
  orderBy: 'name;country',
  sortedBy: 'asc;desc',
  with: 'author',
  filter: 'name;status;country',
  searchJoin: 'or',
}
```
