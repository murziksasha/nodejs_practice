export class APIFeatures {
  query: any;
  queryString: any;
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObject = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObject[el]);

    const mongoQuery: any = {};
    Object.keys(queryObject).forEach((key) => {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const field = match[1];
        const operator = `$${match[2]}`;
        if (!mongoQuery[field]) mongoQuery[field] = {};
        const val = isNaN(queryObject[key])
          ? queryObject[key]
          : Number(queryObject[key]);
        mongoQuery[field][operator] = val;
      } else {
        mongoQuery[key] = isNaN(queryObject[key])
          ? queryObject[key]
          : Number(queryObject[key]);
      }
    });

    this.query = this.query.find(mongoQuery);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = String(this.queryString.sort).split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryString.fields) {
      const fields = String(this.queryString.fields).split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = parseInt(String(this.queryString.page || '1'), 10);
    const limit = parseInt(String(this.queryString.limit || '100'), 10);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}