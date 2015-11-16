var app = angular.module('StarterApp', ['ngMaterial']);

app.controller('AppController', function($timeout) {
  var vm = this;
  
  // Defaults
  vm.prime = "yes";
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
    vm.prime = "yes";
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
    vm.state.inTraining = !!(vm.prime === "yes");
    vm.state.trainingInstructions = !!(vm.prime === "yes");
    vm.state.inProgress = !!(vm.prime !== "yes");
    vm.state.testInstructions = !!(vm.prime !== "yes");
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
    
    // If we're at 3 tests, kill it
    if (vm.tests.length === 3) {
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
    $timeout(vm.displayTime, 3000);
    $timeout(vm.displayReady, 3000+vm.timeToTest+1000);
    $timeout(vm.displayTime, 2*3000+vm.timeToTest+2000);
    $timeout(vm.displayReady, 2*3000+2*vm.timeToTest+3000);
    $timeout(vm.displayTime, 3*3000+2*vm.timeToTest+4000);
    $timeout(vm.goToTest, 3*3000+3*vm.timeToTest+5000)
  };
  
   vm.continueTraining = function() {
    vm.state.trainingInstructions = false;
    vm.startTraining();
  };

});