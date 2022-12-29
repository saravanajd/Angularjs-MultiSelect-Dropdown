(function (window, angular) {
  "use strict";

  const apps = angular.module("DropDownMultiSelect", []);

  apps.run([
    "$templateCache",
    function ($templateCache) {
      $templateCache.put(
        "template/dropdownMultiSelect.html",
        [
          '<div class="ng-dropdown-container">',
          '    <div class="ng-dropdown-text">',
          '        <span>{{labelText ? labelText : "-- Select -- "}}</span>',
          "    </div>",
          '    <ul class="ng-dropdown-options">',
          '        <li class="ng-dropdown-item" ng-if="ddLabel">',
          '            <input type="text" class="ng-dropdown-search" ng-model="searchText">',
          "        </li>",
          '        <li class="ng-dropdown-item" ng-click="isHeaderCheckBoxChecked=!isHeaderCheckBoxChecked;onHeaderCheckBoxChecked()">',
          '            <input type="checkbox" ng-model="isHeaderCheckBoxChecked" ng-change="onHeaderCheckBoxChecked()">',
          "             -- Select All --",
          "        </li>",
          '        <li class="ng-dropdown-item" ng-class="{\'selected\':item === ddModel}" ',
          '        ng-repeat="item in ddData | filter:ddSearchFilter" data-item="{{item}}" ng-click="SelectItem($event,item)">',
          '            <input type="checkbox" ng-model="item.selected">',
          "            {{ddLabel ? item[ddLabel] : item}}",
          "        </li>",
          "    </ul>",
          "</div>",
        ].join("")
      );
    },
  ]);

  apps.directive("dropdownMultiSelect", [
    function () {
      return {
        restrict: "E",
        replace: true,
        scope: {
          ddModel: "=",
          ddData: "=",
          ddLabel: "@",
          ddChange: "&?",
          ddClosed: "&?",
        },
        controller: [
          "$scope",
          "$element",
          "$document",
          "filterFilter",
          function ($scope, $element, $document, filterFilter) {
            $scope.searchText = "";
            $scope.labelText = "";
            $scope.isHeaderCheckBoxChecked = false;

            $scope.init = function () {
              if (!$scope.ddLabel) {
                console.warn("'dd-label' text is empty!!!");
              }

              console.log('$scope.ddData', $scope.ddData);
              $scope.ddData = $scope.ddData || [];
              if (!$scope.isArray($scope.ddData)) {
                throw new Error(
                  "invalid data type 'dd-data'. 'dd-data' expects a data type array!!!"
                );
              }
              $scope.ddModel = $scope.ddModel || [];
              if (!$scope.isArray($scope.ddModel)) {
                throw new Error(
                  "invalid data type 'dd-model'. 'dd-model' expects a data type array!!!"
                );
              }

              $scope.getLabelText();
            };

            $scope.isArray = function (arr) {
              return (
                Object.prototype.toString.call($scope.ddModel) ==
                "[object Array]"
              );
            };

            $scope.getLabelText = function () {
              if (!$scope.ddModel || $scope.ddModel.length < 1) {
                $scope.labelText = "";
                return;
              }

              $scope.labelText = $scope.ddModel
                .map((item) => {
                  return $scope.ddLabel ? item[$scope.ddLabel] : item;
                })
                .join(", ");
            };

            $scope.ddSearchFilter = function (item) {
              return (
                !$scope.searchText ||
                $scope.ddLabel ||
                (item[$scope.ddLabel] &&
                  item[$scope.ddLabel]
                    .toLowerCase()
                    .indexOf($scope.searchText.toLowerCase()) > -1)
              );
            };

            $scope.SelectItem = function ($event, item) {
              item.selected = item.selected ? false : true;

              if (item.selected) {
                $scope.ddModel.push(item);
              } else {
                const index = $scope.ddModel.indexOf(item);
                if (index > -1) {
                  $scope.ddModel.splice(index, 1);
                }
              }

              $scope.isHeaderCheckBoxChecked =
                $scope.ddData.length == $scope.ddModel.length;

              $scope.getLabelText();
              setTimeout(function () {
                $scope.$eval($scope.ddChange);
              }, 100);
            };

            $scope.onHeaderCheckBoxChecked = function () {

              $scope.ddModel = [];
              $scope.ddData.forEach(function (item) {
                item.selected = $scope.isHeaderCheckBoxChecked;                
                if ($scope.isHeaderCheckBoxChecked) {
                  $scope.ddModel.push(item);
                }
              });

              if (!$scope.isHeaderCheckBoxChecked) {
                $scope.labelText = "";
              }

              $scope.getLabelText();
              setTimeout(function () {
                $scope.$eval($scope.ddChange);
              }, 100);
            };

            $scope.$watch("ddData", function (newValue, oldValue) {
              if (newValue == oldValue) {
                return;
              }

              const SelectItem = filterFilter(newValue, $scope.ddModel);
              if (!SelectItem || SelectItem.length < 1) {
                $scope.ddModel = [];
              }
            });

            const onDropDownSelectClick = function ($event) {
              const ele = angular.element($event.target);

              const isTarget = ele.closest(".ng-dropdown-text").length === 1;

              if (isTarget) {
                $element.toggleClass("show");
              }
            };

            const onDocumentMouseUp = function ($event) {
              if (!$event || !$event.target) {
                return;
              }

              const isDropdownContainer =
                $element.has($event.target).length === 1;

              if (!isDropdownContainer) {
                $element.removeClass("show");
                $scope.searchText = "";

                setTimeout(function () {
                  $scope.$eval($scope.ddClosed);
                }, 100);
              }
            };

            $element.on("click", onDropDownSelectClick);

            $document.on("mouseup", onDocumentMouseUp);

            $scope.$on("$destroy", function () {
              element.off("click", onDropDownSelectClick);
              $document.off("mouseup", onDocumentMouseUp);
            });
            $scope.init();
          },
        ],
        templateUrl: "template/dropdownMultiSelect.html",
      };
    },
  ]);
})(window, window.angular);
