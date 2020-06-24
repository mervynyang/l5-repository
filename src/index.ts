import { isString } from './helper';
import {
  WhereItem,
  OrderItem,
  Operator,
  Value,
  OrderDirection,
  Column,
  ColumnItem,
  Comparison,
  Fields,
  Pairs,
} from './type';

class L5Repository {
  private wheres: WhereItem[] = [];
  private orders: OrderItem[] = [];
  private relationships: string[] = [];
  private filters: string[] = [];
  private searchJoinComparison: Comparison = 'or';
  private operators: string[] = ['=', 'like']; // l5 repository 支持的操作符

  where(column: string | Column, operator: Operator | Value = null, value: Value = null) {
    if (Array.isArray(column)) {
      return this.addArrayOfWheres(column);
    }

    [value, operator] = this.prepareValueAndOperator(
      value,
      operator,
      arguments.length === 2,
    );

    if (!isString(operator)) {
      value = operator;
      operator = '=';
    }

    if (!this.operators.includes(operator)) {
      operator = '=';
    }

    this.wheres.push({
      column,
      operator,
      value,
    });

    return this;
  }

  filter(filters: string[]) {
    this.filters = filters;

    return this;
  }

  with(relationship: string) {
    this.relationships.push(relationship);

    return this;
  }

  searchJoin(comparison: Comparison) {
    this.searchJoinComparison = comparison;

    return this;
  }

  orderBy(column: string, direction: OrderDirection = 'asc') {
    this.orders.push({
      column,
      direction,
    });

    return this;
  }

  orderByDesc(column: string) {
    return this.orderBy(column, 'desc');
  }

  /**
   * 多个where嵌套，如 [[a, 1], [b, 2]]
   * @param {array} column
   */
  protected addArrayOfWheres(column: Column) {
    column.forEach((item: ColumnItem) => {
      this.where.apply(this, item);
    });

    return this;
  }

  protected prepareValueAndOperator(value: Value, operator: Operator | Value, useDefault = false) {
    // 默认情况只有2个参数，则operator即为value,操作符默认是"="
    if (useDefault) {
      return [operator, '='];
    }

    return [value, operator];
  }

  protected parseFields(): Fields {
    const search: string[] = [];
    const searchFields: string[] = [];
    const orderBy: string[] = [];
    const sortedBy: string[] = [];

    this.wheres.forEach((condition) => {
      search.push(`${condition.column}:${condition.value}`);
      searchFields.push(`${condition.column}:${condition.operator}`);
    });

    this.orders.forEach((order) => {
      orderBy.push(order.column);
      sortedBy.push(order.direction);
    });

    return {
      search,
      searchFields,
      orderBy,
      sortedBy,
      with: this.relationships,
      filter: this.filters,
      searchJoin: [this.searchJoinComparison]
    };
  }

  toPairs(): Pairs {
    const fields = this.parseFields();
    const keys = Object.keys(fields);
    let pairs: Pairs = {};

    return keys.reduce((acc, key) => {
      if (fields[key] && Array.isArray(fields[key]) && fields[key].length > 0) {
        acc[key] = fields[key].join(';');
      }

      return acc;
    }, pairs);
  }

  toString(): string {
    const fields = this.parseFields();
    const keys = Object.keys(fields);
    let str = '';

    keys.forEach((key) => {
      if (Array.isArray(fields[key]) && fields[key].length > 0) {
        str += `${key}=${fields[key].join(';')}&`;
      }
    });
    // 去掉最后一个 "&" 符号
    str = str.substring(0, str.length - 1);

    return str;
  }
}

export default L5Repository;
