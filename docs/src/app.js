const app = angular.module("DropDownMultiSelectApp", ["DropDownMultiSelect"]);

app.controller("ctrlTest", function ($scope, filterFilter, $timeout) {
  $scope.selectedBrands = [];
  $scope.selectedProducts = [];

  $scope.brandList = BrandList;
  $scope.productList = ProductList;

  $scope.selectedProductNams = [];

  $scope.OnBrandSelected = function () {
  };

  $scope.OnItemChange = function () {
    $timeout(function(){
      if(!$scope.selectedProducts && $scope.selectedProducts.length < 1){
        $scope.selectedProductNams = [];  
      }
      $scope.selectedProductNams = $scope.selectedProducts.map(x => x.Name);
    })
  };
});

const BrandList = [
  {
    BrandId: 1,
    Name: "Apple",
  },
  {
    BrandId: 2,
    Name: "Samsung",
  },
  {
    BrandId: 3,
    Name: "Google",
  },
  {
    BrandId: 4,
    Name: "Microsoft",
  },
];

const ProductList = [
  {
    ProductId: 1,
    BrandId: 1,
    Name: "Mobile",
  },
  {
    ProductId: 2,
    BrandId: 1,
    Name: "Accessories",
  },
  {
    ProductId: 3,
    BrandId: 1,
    Name: "Watch",
  },
  {
    ProductId: 4,
    BrandId: 2,
    Name: "Mobile",
  },
  {
    ProductId: 5,
    BrandId: 3,
    Name: "Accessories",
  },
  {
    ProductId: 6,
    BrandId: 3,
    Name: "AR",
  },
];
