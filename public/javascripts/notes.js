var deleteNote = function (noteid) {
	$.ajax({
		type: 'POST',
		url: '/deleteNote',
		data: {noteid: noteid},
		success: function(nid) {
			$('#nid_'+nid).remove();
		}
		}).done(function(msg) { 
			console.log("ejs msg ", msg); 
		});
};
	
var createNote = function (msg, cid, lid, ques, reply) {
	$.ajax({
		type: 'POST',
		url: '/createNote',
		data: {msg : msg, cid: cid, lid: lid, ques: ques, reply: reply},
		success: function (note) {
			$('#noteList').prepend(addNoteHTML(note));
			deleteN();
		}
		}).done(function(msg) {
			console.log("ejs msg ", msg);
		});
};
	
function deleteN() {
	$('.delete').bind('click',
	function (event) {
		var noteid = $(this).attr("id");  
		deleteNote(noteid);

		return false;
	});
};

function createN() {
	$('.noteSubmit').bind('click',
		function (event) {
			var msg = $("textarea").val();
			var cid_lid = $("textarea").attr("name").split("_");
			var cid = cid_lid[0];
			var lid = cid_lid[1];
			var ques = $('#question').prop("checked");
			createNote(msg, cid, lid, ques, null);
			
			$('textarea').val('');
			$('#question').prop("checked", false);
			return false;
		});
}

function createReply() {
	$('#replySubmit').bind('click',
		function (event) {
			//var reply = $('#compose').attr("name");
			var msg = $('#replyNote').val();
			var cid_lid = $('#replyNote').attr("name").split("_");
			var cid = cid_lid[0];
			var lid = cid_lid[1];
			var ques = $('#replyQuestion').prop("checked");
			var reply = cid_lid[2];
			console.log(cid, lid, reply);
			createNote(msg, cid, lid, ques, reply);
			
			$('#replyNote').val('');
			$('#replyQuestion').prop("checked", false);
			$('#replyModal').modal('toggle');
			return false;
		});
}