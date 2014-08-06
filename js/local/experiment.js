var noOfPeople;
var totalAmt=0;
var avgAmt=0;
var positiveBalance = {name:[],expense:[]};
var negativeBalance = {name:[],expense:[]};
var nameExpense = {name:[],expense:[]};

var htmlInputNameExpense = '<li id="{LISTID}"><input id="input-name" type="text" placeholder="Input Name">'+
					  	   '<input id="input-expense-0" type="text" placeholder="Input expenses"><span id="{ADDERID}" class="glyphicon glyphicon-plus"></span></li>';
var htmlBtnInputNameExpense = '<li><button id="btn-name-expense" class="btn btn-success">Calculate</button>'+
								  '<button id="btn-reset" class="btn btn-info">Reset</button></li>';

$(document).ready(function(){
	
	// get second div according to no. of people entered, It takes name and expenses
	$('#ul-no-of-people').on('click','#btn-no-of-people', function(){
		noOfPeople = $('#input-no-of-people').val();
		if(noOfPeople){
			$('#input-no-of-people').css('display','none');
			$('#btn-no-of-people').css('display','none');
			$('div#variable-div').append('<ul id="ul-name-expense"></ul>').append(htmlBtnInputNameExpense);
			for(var i=0;i<noOfPeople;i++){
				$('#ul-name-expense').append(htmlInputNameExpense.replace("{LISTID}","list_"+i).replace("{ADDERID}", "add-expense-input-"+i));
			}
		}else{
			alert('Please input number of people !');
		}
		bindNameExpenseButton();				// fill the object nameExpense with name and expenses done
		bindResetButton();						// bind reset button
		bindAddExpenseInputField();
	});
	
	var bindAddExpenseInputField = function(){
		$('span').click(function(){
			var adderId = $(this).attr('id');			// get which plus sign clicked
			var listIdOfAdder = $('#'+adderId).parent();		// get its parent list id
			var noOfListItem = listIdOfAdder.children('input').length - 1;			// store size of expense input fields to make new input expense field ids
			listIdOfAdder.append('<input id="input-expense-'+noOfListItem+'" type="text" placeholder="Input expenses">');			// append more input expense field
		});
	};
	
	var bindResetButton = function(){				// Reload the page on the click of reset button
		$('#btn-reset').click(function(){
			location.reload();
		});
	};
	
	var bindNameExpenseButton = function(){
		$('#btn-name-expense').click(function(){
			var countNoOfPeople = $('ul#ul-name-expense li').length;
			try {
				for(var i=0;i<countNoOfPeople;i++){
					var noOfExpenseField = $('#list_'+i+' input').length - 1;
					nameExpense.name.push($('#list_'+i+' #input-name').val());
					var totalExpenseIndividual = 0;
					for(var j = 0; j < noOfExpenseField; j++){
						totalExpenseIndividual += parseInt($('#list_'+i+' #input-expense-'+j).val());
					}
					nameExpense.expense.push(totalExpenseIndividual);
					totalAmt += totalExpenseIndividual;
				}
			} catch (e) {
				console.log("Error at bindNameExpenseButton !");
			}
//			console.log(nameExpense);
//			console.log('Total amount spent : '+totalAmt);
			
			// Calculate Average amount of total expenses
			avgAmt = totalAmt/countNoOfPeople;
			console.log('Average amount is : '+avgAmt);
			$('div.showResult').append('<div class="alert alert-info">'+'Average expense is : '+avgAmt+'</div>');
			
			// Find people with Positive and Negative balance,
			getPositiveNegativeBal();
		});
	};
	
	// Distributing +ve and -ve Balance in two different Objects
	var getPositiveNegativeBal = function(){
		for(var i=0;i<nameExpense.name.length;i++){
			var checkBal = nameExpense.expense[i] - avgAmt;
			if(checkBal >= 0){
				positiveBalance.expense.push(checkBal);
				positiveBalance.name.push(nameExpense.name[i]);
			}else{
				negativeBalance.expense.push(checkBal);
				negativeBalance.name.push(nameExpense.name[i]);
			}
		}
		console.log(positiveBalance);
		console.log(negativeBalance);
		
		// Find out who owes who and How much
		getPaidDueAmt();
	};
	
	var getPaidDueAmt = function(){
		
		var positivePointer = 0;
		var negativePointer = 0;
		var toZeroPositive = 0;
		var toZeroNegative = 0;
		
		// check for zero balance in the Positive Balance Array
		function checkForZeroBalancePositivefn(){
			checkForZeroBalanceInPositive = positiveBalance.expense.every(function(item, index, array){
				return (item == 0);
			});
			return checkForZeroBalanceInPositive;
		}
		
		while(!checkForZeroBalancePositivefn()){ 					// check for zero balance in the Positive Balance Array
			if(!positiveBalance.expense[positivePointer] == 0){
				
				toZeroPositive = positiveBalance.expense[positivePointer];
				
				if(-(negativeBalance.expense[negativePointer]) >= positiveBalance.expense[positivePointer]){			// if -ve balance is greater then transfer to +ve balance
					negativeBalance.expense[negativePointer] += positiveBalance.expense[positivePointer];			// subtract transferred money from -ve balance
					positiveBalance.expense[positivePointer] -= positiveBalance.expense[positivePointer];			// make positive balance to zero
					
					$('div.showResult').append('<div class="alert alert-warning">'+negativeBalance.name[negativePointer]+' will give '+toZeroPositive+' Rs. to '+positiveBalance.name[positivePointer]+'</div>');
					console.log(negativeBalance.name[negativePointer]+' will give '+toZeroPositive+' Rs. to '+positiveBalance.name[positivePointer]);
				}else{
					toZeroNegative = 0-negativeBalance.expense[negativePointer];							// check how much money it has to send
					
					positiveBalance.expense[positivePointer] += negativeBalance.expense[negativePointer];	// transfer amount from -ve to +ve guy
					negativeBalance.expense[negativePointer] -= negativeBalance.expense[negativePointer];	// make -ve balance zero after money transfer
					
					$('div.showResult').append('<div class="alert alert-warning">'+negativeBalance.name[negativePointer]+' will give '+toZeroNegative+' Rs. to '+positiveBalance.name[positivePointer]+'</div>');
					console.log(negativeBalance.name[negativePointer]+' will give '+toZeroNegative+' Rs. to '+positiveBalance.name[positivePointer]);
					
					negativePointer += 1;																	// Move pointer to next -ve balance
				}
				
			}else{
				positivePointer += 1;
			}
		}
		console.log("Expense Calculated !!");
	};
});