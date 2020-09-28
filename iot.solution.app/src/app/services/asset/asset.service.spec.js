"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var asset_service_1 = require("./asset.service");
describe('AssetService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(asset_service_1.AssetService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=asset.service.spec.js.map