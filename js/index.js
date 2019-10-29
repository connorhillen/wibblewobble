var app = angular.module('StarterApp', ['ngMaterial']);

app.controller('AppController', function($timeout) {
  var vm = this;

  // Defaults
  vm.prime = 4;
  vm.numTests = 4;
  vm.timeToTest = 40000;
  vm.state = { begin: true, inTraining: false, trainingInstructions: false, testInstructions: false, inProgress: false, results: false};
  vm.ready = false;
  vm.time = false;
  vm.tests = [];
  vm.currentTest = {};
  vm.tested = false;
  vm.showTested = true;

  vm.restart = function() {
    // Defaults
    vm.prime = 4;
    vm.numTests = 4;
    vm.timeToTest = 40000;
    vm.state = { begin: true, inTraining: false, trainingInstructions: false, testInstructions: false, inProgress: false, results: false};
    vm.ready = false;
    vm.time = false;
    vm.tests = [];
    vm.currentTest = {};
    vm.tested = false;
    vm.showTested = true;
  };

  vm.begin = function() {
    vm.state.begin = false;
    vm.state.inTraining = vm.prime > 0;
    vm.state.trainingInstructions = vm.prime > 0;
    vm.state.inProgress = vm.prime <= 0;
    vm.state.testInstructions = vm.prime <= 0;
  };

  vm.goToTest = function( ){
    vm.state.inTraining = false;
    vm.state.inProgress = true;
    vm.state.testInstructions = true;
  };

  vm.startTest = function() {
    vm.state.testInstructions = false;
    vm.displayReady();
    $timeout(vm.testTime, 3000);
  };

  vm.stopClock = function() {
    vm.time = false;
    vm.currentTest.endTime = new Date().getTime();
    vm.currentTest.delta = vm.timeToTest - (vm.currentTest.endTime - vm.currentTest.startTime);
    vm.currentTest.actual = vm.currentTest.endTime - vm.currentTest.startTime;
    vm.tests.push(vm.currentTest);
    vm.tested = true;
    console.log(vm.tests.length, vm.numTests)
    // If we're at n tests, kill it
    if (vm.tests.length === vm.numTests) {
      vm.state.inProgress = false;
      vm.state.results = true;
      vm.tested = false;
    }
    else {
      vm.startTest();
    }
  };

  vm.testTime = function() {
    vm.time = true;
    vm.currentTest = {};
    vm.currentTest.startTime = new Date().getTime();
  };

  vm.displayReady = function() {
    vm.ready = true;
    $timeout( function() { vm.ready = false; }, 2000);
  };

  vm.displayTime = function() {
    vm.time = true;
    $timeout( function() { vm.time = false; }, vm.timeToTest);
  };

  vm.startTraining = function() {
    vm.displayReady();

    var testTime
    for (let i = 1; i <= vm.prime; i++) {
      // simplified calculations
      const offset = (i - 1) * 1000;
      const displayTime = i * 3000 + ((i - 1) * vm.timeToTest) + offset;
      const readyTime = i * 3000 + (i * vm.timeToTest) + (offset + 1000);

      // determines the timeout
      if (i === vm.prime) testTime = readyTime

      // call timeouts
      $timeout(vm.displayTime, displayTime);
      $timeout(vm.displayReady, readyTime);
    }
    $timeout(vm.goToTest, testTime)
  };

   vm.continueTraining = function() {
    vm.state.trainingInstructions = false;
    vm.startTraining();
  };

});
