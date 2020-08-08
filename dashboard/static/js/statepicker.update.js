//Function to add commas to numbers
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function findStateAbbr(pickedState) {
  let stateToFind = ''
  if (pickedState == 'Kentucky') {
    stateToFind = 'KY'
  } else if (pickedState == 'Arizona') {
    stateToFind = 'AZ'
  } else if (pickedState == 'Alaska') {
    stateToFind = 'AK'
  } else if (pickedState == 'Connecticut') {
    stateToFind = 'CO'
  } else if (pickedState == 'District of Columbia') {
    stateToFind = 'DC'
  } else if (pickedState == 'Georgia') {
    stateToFind = 'GA'
  } else if (pickedState == 'Hawaii') {
    stateToFind = 'HI'
  } else if (pickedState == 'Iowa') {
    stateToFind = 'IA'
  } else if (pickedState == 'Kansas') {
    stateToFind = 'KS'
  } else if (pickedState == 'Louisiana') {
    stateToFind = 'LA'
  } else if (pickedState == 'Maine') {
    stateToFind = 'ME'
  } else if (pickedState == 'Maryland') {
    stateToFind = 'MD'
  } else if (pickedState == 'Minnesota') {
    stateToFind = 'MN'
  } else if (pickedState == 'Mississippi') {
    stateToFind = 'MS'
  } else if (pickedState == 'Missouri') {
    stateToFind = 'MO'
  } else if (pickedState == 'Montana') {
    stateToFind = 'MT'
  } else if (pickedState == 'Nevada') {
    stateToFind = 'NV'
  } else if (pickedState == 'New Hampshire') {
    stateToFind = 'NH'
  } else if (pickedState == 'New Jersey') {
    stateToFind = 'NJ'
  } else if (pickedState == 'New Mexico') {
    stateToFind = 'NM'
  } else if (pickedState == 'New York') {
    stateToFind = 'NY'
  } else if (pickedState == 'North Carolina') {
    stateToFind = 'NC'
  } else if (pickedState == 'North Dakota') {
    stateToFind = 'ND'
  } else if (pickedState == 'Pennsylvania') {
    stateToFind = 'PA'
  } else if (pickedState == 'Rhode Island') {
    stateToFind = 'RI'
  } else if (pickedState == 'South Carolina') {
    stateToFind = 'SC'
  } else if (pickedState == 'South Dakota') {
    stateToFind = 'SD'
  } else if (pickedState == 'Tennessee') {
    stateToFind = 'TN'
  } else if (pickedState == 'Texas') {
    stateToFind = 'TX'
  } else if (pickedState == 'Vermont') {
    stateToFind = 'VT'
  } else if (pickedState == 'Virginia') {
    stateToFind = 'VA'
  } else if (pickedState == 'West Virginia') {
    stateToFind = 'WV'
  } else {
    stateToFind = pickedState.toString().substring(0, 2).toUpperCase()
  }
  return stateToFind
}

$(document).on('change', '#statePicker', function () {
  var e = document.getElementById('statePicker')
  var statePicked = e.options[e.selectedIndex].text

  document.getElementById('currentState').innerHTML = statePicked
  document.getElementById('pollCurrentSate').innerHTML = statePicked

  fetch('http://localhost:3000/api/poll/' + statePicked, { mode: 'cors' })
    .then((resp) => resp.json())
    .then(function (data) {
      var poll_arr = data.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
      })
      console.log(poll_arr)

      let state_biden_pct = []
      let state_trump_pct = []

      for (var i = 0; i < poll_arr.length; i++) {
        if (poll_arr[i].candidate == 'Joseph R. Biden Jr.') {
          state_biden_pct.push(poll_arr[i].pct)
        } else {
          state_trump_pct.push(poll_arr[i].pct)
        }
      }

      var biden_total = 0
      for (var i = 0; i < state_biden_pct.length; i++) {
        if (state_biden_pct.length < 1) {
          biden_total = 0
        } else {
          biden_total += parseInt(state_biden_pct[i])
        }
      }
      var biden_avg =
        biden_total == 0 ? 0 : biden_total / state_biden_pct.length
      document.getElementById(
        'natBidenResults',
      ).innerHTML = `Biden: ${Math.floor(biden_avg)}%`

      var trump_total = 0
      for (var i = 0; i < state_trump_pct.length; i++) {
        if (state_trump_pct.length < 1) {
          trump_total = 0
        } else {
          trump_total += parseInt(state_trump_pct[i])
        }
      }
      var trump_avg =
        trump_total == 0 ? 0 : trump_total / state_trump_pct.length

      document.getElementById(
        'natTrumpResults',
      ).innerHTML = `Trump: ${Math.floor(trump_avg)}%`
    })

  let stateToFind = findStateAbbr(statePicked)
  console.log(stateToFind)

  fetch('http://localhost:3000/api/state/' + stateToFind, { mode: 'cors' })
    .then((resp) => resp.json())
    .then(function (data) {
      state_covid_arr = data.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
      })

      var state_cases_total = 0
      var state_deaths_total = 0

      for (var j = 0; j < state_covid_arr.length; j++) {
        currentDataNode = state_covid_arr[j]

        state_cases_total += currentDataNode.confirmed_cases
        state_deaths_total += currentDataNode.deaths
      }

      document.getElementById(
        'natCaseSpan',
      ).innerHTML = `Cases: ${numberWithCommas(state_cases_total)}`
      document.getElementById(
        'natDeathSpan',
      ).innerHTML = `Deaths: ${numberWithCommas(state_deaths_total)}`
    })
})
