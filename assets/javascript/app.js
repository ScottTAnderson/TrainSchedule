// Initialize Firebase
var config = {
    apiKey: "AIzaSyB95s-t4fFh9X71byV0Xrz5yWEsUDFjXhA",
    authDomain: "assignment7-trainschedule.firebaseapp.com",
    databaseURL: "https://assignment7-trainschedule.firebaseio.com",
    projectId: "assignment7-trainschedule",
    storageBucket: "assignment7-trainschedule.appspot.com",
    messagingSenderId: "730885134176"
};

firebase.initializeApp(config);
var database = firebase.database();

//if all fields filled, add newTrain to firebase
$('.submitButton').on('click', function (event) {
    event.preventDefault();

    var trainName = $('.trainName').val().trim();
    var destination = $('.destination').val().trim();
    var firstTrainTime = $('.firstTrainTime').val().trim();
    var frequency = $('.frequency').val().trim();
    
    //change missing field text to red to alert user to problem
    if(trainName == '') {
        $('#trainName').css('color', 'red');
        $('.addTrain').text('Add Train (All Fields Required)');
    } else {
        $('#trainName').css('color', 'black');
    };
    
    if(destination == '') {
        $('#destination').css('color', 'red');
        $('.addTrain').text('Add Train (All Fields Required)');
    } else {
        $('#destination').css('color', 'black');
    };
    
    if(firstTrainTime == '') {
        $('#firstTrainTime').css('color', 'red');
        $('.addTrain').text('Add Train (All Fields Required)');
    } else {
        $('#firstTrainTime').css('color', 'black');
    };

    if(frequency == '') {
        $('#frequency').css('color', 'red');
        $('#frequency').text('Frequency (min)');
        $('.addTrain').text('Add Train (All Fields Required)');
    } else if($.isNumeric(frequency)) {
        $('#frequency').css('color', 'black');
        $('#frequency').text('Frequency (min)');
    } else {
        $('#frequency').css('color', 'red');
        $('#frequency').text('Frequency (min) MUST BE A NUMBER');
    };

     //check to see if all fields are filled
    if (trainName && destination && firstTrainTime && frequency != '' && $.isNumeric(frequency)) {
        var newTrain = {
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        };

        database.ref().push(newTrain);

        updateEveryMinute();

        var trainName = $('.trainName').val('');
        var destination = $('.destination').val('');
        var firstTrainTime = $('.firstTrainTime').val('');
        var frequency = $('.frequency').val('');

        $('.addTrain').text('Add Train');

        $('#frequency').css('color', 'black');
        $('#frequency').text('Frequency (min)');
    };
    
});

//updates html with current firebase list of trains and updates based on setInterval below // currently every 5 seconds
function updateEveryMinute() {
    $('.trainUpdate').empty();
    database.ref().on('child_added', function (snapshot) {
        var trainName = snapshot.val().trainName;
        var destination = snapshot.val().destination;
        var firstTrainTime = snapshot.val().firstTrainTime;
        var frequency = snapshot.val().frequency;

        var firstTrainTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, 'years');

        var timeDiff = moment().diff(moment(firstTrainTimeConverted), 'minutes');
        var timeDiffRemainder = timeDiff % frequency;
        var minutesUntilNextTrain = frequency - timeDiffRemainder;
        var nextTrain = moment().add(minutesUntilNextTrain, 'minutes').format('HH:mm');

        var newRow = $('<tr>').append(
            $('<td>').text(trainName),
            $('<td>').text(destination),
            $('<td>').text(frequency),
            $('<td>').text(nextTrain),
            $('<td>').text(minutesUntilNextTrain)
        );

        $('tbody').append(newRow);
    });
}

updateEveryMinute();
setInterval('updateEveryMinute()', 5000);