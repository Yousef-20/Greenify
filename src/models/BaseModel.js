class BaseModel {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async findOne(query) {
        return await this.model.findOne(query);
    }

    async find(query = {}) {
        return await this.model.find(query);
    }

    async findSelect(query = {}, selectFields) {
        return await this.model.find(query).select(selectFields);
    }

    async updateById(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteById(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async findByIdSelect(id, selectFields) {
        return await this.model.findById(id).select(selectFields);
    }

    // Expose the Mongoose model directly for methods like `select`
    getModel() {
        return this.model;
    }
}

module.exports = BaseModel; 