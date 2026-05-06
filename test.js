var group1 = gs.getProperty("d365.access.request.check.xos.group") ;
var group2 = gs.getProperty("d365.access.request.check.training.group") ;

var roleBasedGroups = fd_data.flow_var.approval_groups.split(',');

var grps = [group1,group2].concat(roleBasedGroups) ;

var allGroupIds = grps.join(',') ;
var rule = '';

for (var i = 0; i < grps.length; i++) {
  if (rule == '') {
    rule = 'ApprovesAnyG[' + grps[i] + ']'; // First group
  } else {
    rule += '&AnyG[' + grps[i] + ']'; // Subsequent groups
  }
}
if (rule != '') {
  rule += "OrRejectsAnyG[" + allGroupIds + "]"; // Reject if any member from *any* group rejects
}
return rule;

// var grps = fd_data.flow_var.approval_groups.split(',');

// var allGroupIds = fd_data.flow_var.approval_groups; // For RejectsAnyG
// var rule = '';

// for (var i = 0; i < grps.length; i++) {
//   if (rule == '') {
//     rule = 'ApprovesAnyG[' + grps[i] + ']'; // First group
//   } else {
//     rule += '&AnyG[' + grps[i] + ']'; // Subsequent groups
//   }
// }
// if (rule != '') {
//   rule += "OrRejectsAnyG[" + allGroupIds + "]"; // Reject if any member from *any* group rejects
// }
// return rule;