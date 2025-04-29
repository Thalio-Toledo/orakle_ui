export type Param = { key: string; value: string | number | boolean };

export class UrlBuilder {
  constructor(
    private readonly baseUrl: string,
    private readonly routes: readonly string[],
    private readonly params: readonly Param[]
  ) {}

  get built(): string {
    console.warn(this.build());
    return this.build();
  }

  public static from(baseUrl: string): UrlBuilder {
    return new UrlBuilder(baseUrl, [], []);
  }

  public static addListToParams(params: number[], key: string): Param[] {
    return params.map(num => ({ key: `${key}`, value: num }));
  }

  public addRoute(route: string | number | boolean): UrlBuilder {
    if (route === null || route === undefined) {
      return this;
    }
    return new UrlBuilder(this.baseUrl, [...this.routes, route.toString()] as const, this.params);
  }

  public addParam(param: Param): UrlBuilder {
    return new UrlBuilder(this.baseUrl, this.routes, [...this.params, param] as const);
  }

  public addParams(params: Param[]): UrlBuilder {
    return new UrlBuilder(this.baseUrl, this.routes, [...this.params, ...params] as const);
  }

  public addQuery(key: string, value: string | number | boolean): UrlBuilder {
    return this.addParam({ key, value });
  }

  public populateParams(obj: any): UrlBuilder {
    if (!obj) {
      return this;
    }

    let result: UrlBuilder = this;

    Object.keys(obj).forEach(key => {
      const val = obj[key];
      if (val !== undefined && val !== null) {
        if (Array.isArray(val)) {
          val.forEach(v => (result = result.addParam({ key, value: v })));
        } else if (typeof val === 'object') {
          result = result.populateParams(val);
        } else {
          result = result.addParam({ key, value: val });
        }
      }
    });
    return result;
  }

  public build(): string {
    const baseUrl = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';

    const url = baseUrl + this.routes.join('/').replace(/\/\//g, '/');
    const params = this.params.map(param => `${param.key}=${param.value}`).join('&');
    const result = url + (params ? '?' + params : '');

    return result;
  }
}
