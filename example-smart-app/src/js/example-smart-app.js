(function(window){
  window.extractData = function() {
    var ret = $.Deferred();

    function onError() {
      console.log('Loading error', arguments);
      ret.reject();
    }

    function onReady(smart)  {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var app = smart.patient.api.fetchAll({
                    type: 'Appointment',
                    
                  });
        
        $.when(pt, app).fail(onError);

        //Geetting patient details with appointment list
        $.when(pt, app).done(function(patient, app) {

          var gender = patient.gender;

          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given;
            lname = patient.name[0].family;
          }
          
          var p = defaultPatient();
          p.birthdate = patient.birthDate;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;

          getAppointments(app)
          ret.resolve(p);          

        });
      } else {
        onError();
      }
      //Getting patient details with observation
      //   $.when(pt, obv).done(function(patient, obv) {

      //     console.log(obv)
      //     var byCodes = smart.byCodes(obv, 'code');
      //     var gender = patient.gender;

      //     var fname = '';
      //     var lname = '';

      //     if (typeof patient.name[0] !== 'undefined') {
      //       fname = patient.name[0].given;
      //       lname = patient.name[0].family;
      //     }

      //     var height = byCodes('8302-2');
      //     var systolicbp = getBloodPressureValue(byCodes('55284-4'),'8480-6');
      //     var diastolicbp = getBloodPressureValue(byCodes('55284-4'),'8462-4');
      //     var hdl = byCodes('2085-9');
      //     var ldl = byCodes('2089-1');

      //     var p = defaultPatient();
      //     p.birthdate = patient.birthDate;
      //     p.gender = gender;
      //     p.fname = fname;
      //     p.lname = lname;
      //     p.height = getQuantityValueAndUnit(height[0]);

      //     if (typeof systolicbp != 'undefined')  {
      //       p.systolicbp = systolicbp;
      //     }

      //     if (typeof diastolicbp != 'undefined') {
      //       p.diastolicbp = diastolicbp;
      //     }

      //     p.hdl = getQuantityValueAndUnit(hdl[0]);
      //     p.ldl = getQuantityValueAndUnit(ldl[0]);

      //     ret.resolve(p);
      //   });
      // } else {
      //   onError();
      // }
    }

    FHIR.oauth2.ready(onReady, onError);
    return ret.promise();

  };

  function defaultPatient(){
    return {
      fname: {value: ''},
      lname: {value: ''},
      gender: {value: ''},
      birthdate: {value: ''},
      height: {value: ''},
      systolicbp: {value: ''},
      diastolicbp: {value: ''},
      ldl: {value: ''},
      hdl: {value: ''},
    };
  }

  function getAppointments(app) {
    Object.values(app).forEach(function (i)  {
      rowCount = 1;
      if(i.status == ("fulfilled" || "booked" || "pending" || "noshow" || "waitlist" || "cancelled")) {
        practitioner = i.participant[0].actor.display
      } else {
        practitioner = "Not Alloted"
      }
      console.log(i.start, i.end)
      var table = document.getElementById("appointment");
      var row = table.insertRow(rowCount);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      cell1.innerHTML = i.id;
      cell2.innerHTML = practitioner
      cell3.innerHTML = i.status;
      cell4.innerHTML = i.start == undefined ? "" : i.start;
      cell5.innerHTML = i.end  == undefined ? "" : i.end;
      rowCount += 1;
    });
  }
  // function getBloodPressureValue(BPObservations, typeOfPressure) {
  //   var formattedBPObservations = [];
  //   BPObservations.forEach(function(observation){
  //     var BP = observation.component.find(function(component){
  //       return component.code.coding.find(function(coding) {
  //         return coding.code == typeOfPressure;
  //       });
  //     });
  //     if (BP) {
  //       observation.valueQuantity = BP.valueQuantity;
  //       formattedBPObservations.push(observation);
  //     }
  //   });

  //   return getQuantityValueAndUnit(formattedBPObservations[0]);
  // }

  // function getQuantityValueAndUnit(ob) {
  //   if (typeof ob != 'undefined' &&
  //       typeof ob.valueQuantity != 'undefined' &&
  //       typeof ob.valueQuantity.value != 'undefined' &&
  //       typeof ob.valueQuantity.unit != 'undefined') {
  //         return ob.valueQuantity.value + ' ' + ob.valueQuantity.unit;
  //   } else {
  //     return undefined;
  //   }
  // }

  window.drawVisualization = function(p) {
    $('#holder').show();
    $('#loading').hide();
    $('#fname').html(p.fname);
    $('#lname').html(p.lname);
    $('#gender').html(p.gender);
    $('#birthdate').html(p.birthdate);
    $('#height').html(p.height);
    $('#systolicbp').html(p.systolicbp);
    $('#diastolicbp').html(p.diastolicbp);
    $('#ldl').html(p.ldl);
    $('#hdl').html(p.hdl);
  };

})(window);
