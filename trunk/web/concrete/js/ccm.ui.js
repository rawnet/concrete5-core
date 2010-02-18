var ccm_pageMenus = new Array();
var ccm_uiLoaded = true;
var ccm_deactivateTimer = false;
var ccm_deactivateTimerTime = 2000;
var ccm_topPaneDeactivated = false;
var ccm_topPaneTargetURL = false;
var ccm_selectedDomID = false;
var ccm_isBlockError = false;
var ccm_blockError = "";
var ccm_menuActivated = false;
var ccm_bcEnabled = false;
var ccm_bcEnabledTimer = false;
var ccm_arrangeMode = false;

ccm_menuInit = function(obj) {
	
	if (CCM_EDIT_MODE && (!CCM_ARRANGE_MODE)) {
		switch(obj.type) {
			case "BLOCK":
				$("#b" + obj.bID + "-" + obj.aID).mouseover(function(e) {
					if (!ccm_menuActivated) {
						ccm_activate(obj, "#b" + obj.bID + "-" + obj.aID);
					}
				});
				break;
			case "AREA":
				$("#a" + obj.aID + "controls").mouseover(function(e) {
				if (!ccm_menuActivated) {
					ccm_activate(obj, "#a" + obj.aID + "controls");
				}
				});
				break;
		}
	}	
}

ccm_showBlockMenu = function(obj, e) {
	ccm_hideMenus();
	e.stopPropagation();
	ccm_menuActivated = true;
	
	// now, check to see if this menu has been made
	var bobj = document.getElementById("ccm-block-menu" + obj.bID + "-" + obj.aID);

	if (!bobj) {
		// create the 1st instance of the menu
		el = document.createElement("DIV");
		el.id = "ccm-block-menu" + obj.bID + "-" + obj.aID;
		el.className = "ccm-menu";
		el.style.display = "none";
		document.body.appendChild(el);
		
		bobj = $("#ccm-block-menu" + obj.bID + "-" + obj.aID);
		bobj.css("position", "absolute");
		
		//contents  of menu
		var html = '<div class="ccm-menu-tl"><div class="ccm-menu-tr"><div class="ccm-menu-t"></div></div></div>';
		html += '<div class="ccm-menu-l"><div class="ccm-menu-r">';
		html += '<ul>';
		//html += '<li class="header"></li>';
		if (obj.canWrite) {
			html += (obj.editInline) ? '<li><a class="ccm-icon" id="menuEdit' + obj.bID + '-' + obj.aID + '" href="' + CCM_DISPATCHER_FILENAME + '?cID=' + CCM_CID + '&bID=' + obj.bID + '&arHandle=' + obj.arHandle + '&isGlobal=' + obj.isGlobal + '&btask=edit#_edit' + obj.bID + '"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/edit_small.png)">' + ccmi18n.editBlock + '</span></a></li>'
				: '<li><a class="ccm-icon" dialog-title="' + ccmi18n.editBlock + '" dialog-modal="false" dialog-width="' + obj.width + '" dialog-height="' + obj.height + '" id="menuEdit' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + CCM_CID + '&bID=' + obj.bID + '&arHandle=' + obj.arHandle + '&isGlobal=' + obj.isGlobal + '&btask=edit"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/edit_small.png)">' + ccmi18n.editBlock + '</span></a></li>';
		}
		html += '<li><a class="ccm-icon" dialog-title="' + ccmi18n.copyBlockToScrapbook + '" dialog-modal="false" dialog-width="250" dialog-height="100" id="menuAddToScrapbook' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/pile_manager.php?cID=' + CCM_CID + '&bID=' + obj.bID + '&arHandle=' + obj.arHandle + '&btask=add"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/paste_small.png)">' + ccmi18n.copyBlockToScrapbook + '</span></a></li>';

		if (obj.canArrange) {
			html += '<li><a class="ccm-icon" id="menuArrange' + obj.bID + '-' + obj.aID + '" href="javascript:ccm_arrangeInit()"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/up_down.png)">' + ccmi18n.arrangeBlock + '</span></a></li>';

			//html += '<li><a class="ccm-icon" id="menuArrange' + obj.bID + '-' + obj.aID + '" href="' + CCM_DISPATCHER_FILENAME + '?cID=' + CCM_CID + '&btask=arrange"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/up_down.png)">' + ccmi18n.arrangeBlock + '</span></a></li>';
		}
		if (obj.canDelete) {
			html += '<li><a class="ccm-icon" id="menuDelete' + obj.bID + '-' + obj.aID + '" href="#" onclick="javascript:ccm_deleteBlock(' + obj.bID + ',' + obj.aID + ', \'' + obj.arHandle + '\', \'' + obj.deleteMessage + '\');return false;"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/delete_small.png)">' + ccmi18n.deleteBlock + '</span></a></li>';
		} 		
		if (obj.canWrite) {
			html += '<li class="header"></li>';
			html += '<li><a class="ccm-icon" dialog-modal="false" dialog-title="' + ccmi18n.changeBlockBaseStyle + '" dialog-width="450" dialog-height="420" id="menuChangeCSS' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + CCM_CID + '&bID=' + obj.bID + '&isGlobal=' + obj.isGlobal + '&arHandle=' + obj.arHandle + '&btask=block_css&modal=true&width=300&height=100" title="' + ccmi18n.changeBlockCSS + '"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/design_small.png)">' + ccmi18n.changeBlockCSS + '</span></a></li>';
			html += '<li><a class="ccm-icon" dialog-modal="false" dialog-title="' + ccmi18n.changeBlockTemplate + '" dialog-width="300" dialog-height="100" id="menuChangeTemplate' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + CCM_CID + '&bID=' + obj.bID + '&isGlobal=' + obj.isGlobal + '&arHandle=' + obj.arHandle + '&btask=template&modal=true&width=300&height=100" title="' + ccmi18n.changeBlockTemplate + '"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/wrench.png)">' + ccmi18n.changeBlockTemplate + '</span></a></li>';
		}

		if (obj.canModifyGroups || obj.canAliasBlockOut) {
			html += '<li class="header"></li>';
		}

		if (obj.canModifyGroups) {
			html += '<li><a title="' + ccmi18n.setBlockPermissions + '" class="ccm-icon" dialog-width="400" dialog-height="380" id="menuBlockGroups' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + CCM_CID + '&bID=' + obj.bID + '&arHandle=' + obj.arHandle + '&btask=groups" dialog-title="' + ccmi18n.setBlockPermissions + '"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/permissions_small.png)">' + ccmi18n.setBlockPermissions + '</span></a></li>';
		}
		if (obj.canAliasBlockOut) {
			html += '<li><a class="ccm-icon" dialog-width="550" dialog-height="450" id="menuBlockAliasOut' + obj.bID + '-' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_block_popup.php?cID=' + CCM_CID + '&bID=' + obj.bID + '&arHandle=' + obj.arHandle + '&btask=child_pages" dialog-title="' + ccmi18n.setBlockAlias + '"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/template_block.png)">' + ccmi18n.setBlockAlias + '</span></a></li>';
		}
		

		html += '</ul>';
		html += '</div></div>';
		html += '<div class="ccm-menu-bl"><div class="ccm-menu-br"><div class="ccm-menu-b"></div></div></div>';
		bobj.append(html);
		
		// add dialog elements where necessary
		if (obj.canWrite && (!obj.editInline)) {
			$('a#menuEdit' + obj.bID + '-' + obj.aID).dialog();
			$('a#menuChangeTemplate' + obj.bID + '-' + obj.aID).dialog();
			$('a#menuChangeCSS' + obj.bID + '-' + obj.aID).dialog();	
		}
		if (obj.canAliasBlockOut) {
			$('a#menuBlockAliasOut' + obj.bID + '-' + obj.aID).dialog();
		}
		if (obj.canModifyGroups) {
			$("#menuBlockGroups" + obj.bID + '-' + obj.aID).dialog();
		}
		$("#menuAddToScrapbook" + obj.bID + '-' + obj.aID).dialog(); 

	} else {
		bobj = $("#ccm-block-menu" + obj.bID + '-' + obj.aID);
	}
	
	ccm_fadeInMenu(bobj, e);

}

ccm_showAreaMenu = function(obj, e) {
	var addOnly = (obj.addOnly)?1:0;

	if (e.shiftKey) {
		$.fn.dialog.open({
			title: ccmi18n.blockAreaMenu,
			href: CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&atask=add&arHandle=' + obj.arHandle + '&addOnly=' + addOnly,
			width: 550,
			modal: false,
			height: 380
		});
	} else {
		ccm_hideMenus();
		e.stopPropagation();
		ccm_menuActivated = true;
		
		// now, check to see if this menu has been made
		var aobj = document.getElementById("ccm-area-menu" + obj.aID);
		
		if (!aobj) {
			// create the 1st instance of the menu
			el = document.createElement("DIV");
			el.id = "ccm-area-menu" + obj.aID;
			el.className = "ccm-menu";
			el.style.display = "none";
			document.body.appendChild(el);
			
			aobj = $("#ccm-area-menu" + obj.aID);
			aobj.css("position", "absolute");
			
			//contents  of menu
			var html = '<div class="ccm-menu-tl"><div class="ccm-menu-tr"><div class="ccm-menu-t"></div></div></div>';
			html += '<div class="ccm-menu-l"><div class="ccm-menu-r">';
			html += '<ul>';
			//html += '<li class="header"></li>';
			if (obj.canAddBlocks) {
				html += '<li><a class="ccm-icon" dialog-title="' + ccmi18n.addBlockNew + '" dialog-modal="false" dialog-width="550" dialog-height="380" id="menuAddNewBlock' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + obj.arHandle + '&atask=add&addOnly=' + addOnly + '"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/add.png)">' + ccmi18n.addBlockNew + '</span></a></li>';
				html += '<li><a class="ccm-icon" dialog-title="' + ccmi18n.addBlockPaste + '" dialog-modal="false" dialog-width="550" dialog-height="380" id="menuAddPaste' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + obj.arHandle + '&atask=paste&addOnly=' + addOnly + '"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/paste_small.png)">' + ccmi18n.addBlockPaste + '</span></a></li>';
			}
			if (obj.canAddBlocks && obj.canWrite) {
				html += '<li class="header"></li>';
			}
			if (obj.canWrite) {
				html += '<li><a class="ccm-icon" dialog-title="' + ccmi18n.addAreaLayout + '" dialog-modal="false" dialog-width="550" dialog-height="380" id="menuAreaLayout' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + obj.arHandle + '&atask=layout"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/wrench.png)">' + ccmi18n.addAreaLayout + '</span></a></li>';
				html += '<li><a class="ccm-icon" dialog-title="' + ccmi18n.changeAreaCSS + '" dialog-modal="false" dialog-width="450" dialog-height="420" id="menuAreaStyle' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + obj.arHandle + '&atask=design"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/design_small.png)">' + ccmi18n.changeAreaCSS + '</span></a></li>';
			}
			if (obj.canWrite && obj.canModifyGroups) { 
				html += '<li class="header"></li>';			
			}
			if (obj.canModifyGroups) {
				html += '<li><a title="' + ccmi18n.setAreaPermissions + '" dialog-modal="false" class="ccm-icon" dialog-width="580" dialog-height="420" id="menuAreaGroups' + obj.aID + '" href="' + CCM_TOOLS_PATH + '/edit_area_popup.php?cID=' + CCM_CID + '&arHandle=' + obj.arHandle + '&atask=groups" dialog-title="' + ccmi18n.setAreaPermissions + '"><span style="background-image: url(' + CCM_IMAGE_PATH + '/icons/permissions_small.png)">' + ccmi18n.setAreaPermissions + '</span></a></li>';
			}
			
			html += '</ul>';
			html += '</div></div>';
			html += '<div class="ccm-menu-bl"><div class="ccm-menu-br"><div class="ccm-menu-b"></div></div></div>';
			aobj.append(html);
			
			// add dialog elements where necessary
			if (obj.canAddBlocks) {
				$('a#menuAddNewBlock' + obj.aID).dialog();
				$('a#menuAddPaste' + obj.aID).dialog(); 
			}
			if (obj.canWrite) {
				$('a#menuAreaStyle' + obj.aID).dialog();
				$('a#menuAreaLayout' + obj.aID).dialog();
			}
			if (obj.canModifyGroups) {
				$('a#menuAreaGroups' + obj.aID).dialog();
			}
		
		} else {
			aobj = $("#ccm-area-menu" + obj.aID);
		}

		ccm_fadeInMenu(aobj, e);		

	}
}

ccm_hideHighlighter = function() {
	$("#ccm-highlighter").css('display', 'none');
}

ccm_addError = function(err) {
	ccm_isBlockError = true;
	ccm_blockError += err;
}

ccm_resetBlockErrors = function() {
	ccm_isBlockError = false;
	ccm_blockError = "";
}

ccm_deleteBlock = function(bID, aID, arHandle, msg) {
	if (confirm(msg)) {
		// got to grab the message too, eventually
		ccm_hideHighlighter();
		ccm_menuActivated = true;
		$.ajax({
 		type: 'POST',
 		url: CCM_DISPATCHER_FILENAME,
 		data: 'cID=' + CCM_CID + '&ccm_token=' + CCM_SECURITY_TOKEN + '&isAjax=true&btask=remove&bID=' + bID + '&arHandle=' + arHandle,
 		success: function(resp) {
 			ccm_hideHighlighter();
 			$("#b" + bID + '-' + aID).fadeOut(100, function() {
 				ccm_menuActivated = false;
 			});
 			ccmAlert.hud(ccmi18n.deleteBlockMsg, 2000, 'delete_small', ccmi18n.deleteBlock);
 		}});		
	}
}

ccm_hideMenus = function() {
	/* 1st, hide all items w/the css menu class */
	$("div.ccm-menu").hide();
	ccm_menuActivated = false;
}

ccm_parseBlockResponse = function(r, currentBlockID, task) {
	try {
		resp = eval('(' + r + ')');
		if (resp.error == true) {
			var message = '<ul>'
			for (i = 0; i < resp.response.length; i++) {						
				message += '<li>' + resp.response[i] + '<\/li>';
			}
			message += '<\/ul>';
			ccmAlert.notice(ccmi18n.error, message);
		} else {
			jQuery.fn.dialog.closeTop();
			var action = CCM_TOOLS_PATH + '/edit_block_popup?cID=' + CCM_CID + '&bID=' + resp.bID + '&arHandle=' + resp.arHandle + '&btask=view_edit_mode';	
			$.get(action, 		
				function(r) {
					if (task == 'add') {
						if ($("#a" + resp.aID + " div.ccm-area-styles").length > 0) {
							$("#a" + resp.aID + " div.ccm-area-styles").append(r);
						} else {
							$("#a" + resp.aID).append(r);
						}
					} else {
						$('#b' + currentBlockID + '-' + resp.aID).before(r).remove();
					}
					jQuery.fn.dialog.hideLoader();
					ccm_mainNavDisableDirectExit();
					setTimeout(function() {
						ccm_menuActivated = false;
					}, 200);
					if (task == 'add') {
						ccmAlert.hud(ccmi18n.addBlockMsg, 2000, 'add', ccmi18n.addBlock);
						// second closetop. Not very elegant
						jQuery.fn.dialog.closeTop();
					} else {
						ccmAlert.hud(ccmi18n.updateBlockMsg, 2000, 'success', ccmi18n.updateBlock);
					}
				}
			);
		}
	} catch(e) {
		alert(r);
	}
}

ccm_mainNavDisableDirectExit = function() {
	// make sure that exit edit mode is enabled
	$("li.ccm-main-nav-exit-edit-mode-direct").hide();
	$("li.ccm-main-nav-exit-edit-mode").show();
}

ccm_setupBlockForm = function(form, currentBlockID, task) {
	form.ajaxForm({
		type: 'POST',
		iframe: true,
		beforeSubmit: function() {
			ccm_hideHighlighter();
			jQuery.fn.dialog.showLoader();
			ccm_menuActivated = true;
			return ccm_blockFormSubmit();
		},
		success: function(r) {
			ccm_parseBlockResponse(r, currentBlockID, task);
		}
	});
}



ccm_activate = function(obj, domID) { 
	if (ccm_topPaneDeactivated) {
		return false;
	}
	
	if (ccm_arrangeMode) {
		return false;
	}
	
	if (ccm_selectedDomID) {
		$(ccm_selectedDomID).removeClass('selected');
	}
	
	aobj = $(domID);
	aobj.addClass('selected');
	ccm_selectedDomID = domID;
	
	offs = aobj.offset();

	/* put highlighter over item. THanks dimensions plugin! */
	
	$("#ccm-highlighter").css("width", aobj.outerWidth());
	$("#ccm-highlighter").css("height", aobj.outerHeight());
	$("#ccm-highlighter").css("top", offs.top);
	$("#ccm-highlighter").css("left", offs.left);
	$("#ccm-highlighter").css("display", "block");
	/*
	$("#ccmMenuHighlighter").mouseover(
		function() {clearTimeout(ccm_deactivateTimer)}
	);
	*/
	$("#ccm-highlighter").unbind('click');
	$("#ccm-highlighter").click(
		function(e) {
			switch(obj.type) {
				case "BLOCK":
					ccm_showBlockMenu(obj, e);
					break;
				case "AREA":
					ccm_showAreaMenu(obj,e);
					break;
			}
		}
	);
}

ccm_editInit = function() {
	ccm_setupHeaderMenu();

	document.write = function() {
		// stupid javascript in html blocks
		void(0);
	}

	$(document.body).append('<div style="position: absolute; display:none" id="ccm-highlighter">&nbsp;</div>');
	$(document).click(function() {ccm_hideMenus();});
	$(document.body).css('user-select', 'none');
	$(document.body).css('-khtml-user-select', 'none');
	$(document.body).css('-webkit-user-select', 'none');
	$(document.body).css('-moz-user-select', 'none');

	$("a").click(function(e) {
		ccm_hideMenus();
		return false;	
	});
	
	/* setup header actions */
	/*
	$('#ccm-main-nav li').each(function(){
		//this.onmouseover=function(){alert('this')}							
	});
	*/
	
	$("a#ccm-nav-mcd").click(function() {
		ccm_showPane(this, CCM_TOOLS_PATH + "/edit_collection_popup.php?ctask=mcd&cID=" + CCM_CID);
	});
	
	$("a#ccm-nav-versions").click(function() {
		ccm_showPane(this, CCM_TOOLS_PATH + "/versions.php?cID=" + CCM_CID);
	});
	
	$("a#ccm-nav-exit-edit").click(function() {
		ccm_showPane(this, CCM_TOOLS_PATH + "/check_in.php?cID=" + CCM_CID);
	});
	
	$("a#ccm-nav-exit-edit-direct").click(function() {
		window.location.href=$(this).attr('href');
	});
	

	$("a#ccm-nav-permissions").click(function() {
		ccm_showPane(this, CCM_TOOLS_PATH + "/edit_collection_popup.php?ctask=edit_permissions&cID=" + CCM_CID);
	});

	$("a#ccm-nav-design").click(function() {
		ccm_showPane(this, CCM_TOOLS_PATH + "/edit_collection_popup.php?ctask=set_theme&cID=" + CCM_CID);
	});

	$("a#ccm-nav-properties").click(function() {
		ccm_showPane(this, CCM_TOOLS_PATH + "/edit_collection_popup.php?ctask=edit_metadata&cID=" + CCM_CID);
	});
	
	$("#ccm-highlighter").mouseout(function() {
		if (!ccm_menuActivated) {
			ccm_hideHighlighter();
		}
	});
		
}

ccm_hidePane = function(onDone) {
	var wrappane = $("#ccm-page-detail");
	$("li.ccm-nav-active").removeClass('ccm-nav-active');
	if (ccm_animEffects) {
		wrappane.fadeOut(60, function() {
			if(!ccm_onPaneCloseObj) ccm_activateSite();
			else ccm_siteActivated = true;
			$(window).unbind('keypress');
			ccm_activateHeader();
			if (typeof onDone == 'function') {
				onDone();
			}
		});
	} else {
		wrappane.hide();
		if(!ccm_onPaneCloseObj) ccm_activateSite();
		else ccm_siteActivated = true;
		$(window).unbind('keypress');
	
		ccm_activateHeader();
	
		if (typeof onDone == 'function') {
			onDone();
		}
	}
}

ccm_deactivateHeader = function(obj) { 
	ccm_topPaneDeactivated = true;
	$("ul#ccm-main-nav").addClass('ccm-pane-open'); 
	if(ccm_dialogOpen) $("ul#ccm-main-nav li").addClass('ccm-nav-rolloversOff');	
	else $("ul#ccm-main-nav li").addClass('ccm-nav-inactive');		
	ccm_hideBreadcrumb();
	if (obj) {
		$(obj).parent().removeClass('ccm-nav-inactive');
		$(obj).parent().addClass('ccm-nav-active');
	}
}

ccm_activateHeader = function() {
	ccm_topPaneDeactivated = false;
	$("ul#ccm-main-nav").removeClass('ccm-pane-open');
	$("ul#ccm-main-nav li").removeClass('ccm-nav-inactive');
	$("ul#ccm-main-nav li").removeClass('ccm-nav-rolloversOff');
}
var ccm_onPaneCloseObj=null;
var ccm_onPaneCloseTargetURL=null;
ccm_showPane = function(obj, targetURL) {
	if (ccm_topPaneDeactivated && ccm_dialogOpen) {
		return false;
	}	
	if(typeof(obj.blur)=='function') obj.blur();
	ccm_onPaneCloseObj=null;
	ccm_onPaneCloseTargetURL=null;
	if (ccm_topPaneDeactivated){
		ccm_onPaneCloseObj=obj;
		ccm_onPaneCloseTargetURL=targetURL;
		ccm_hidePane( function(){ ccm_showPane(ccm_onPaneCloseObj,ccm_onPaneCloseTargetURL) } );
		return false;
	} else {
		ccm_doShowPane(obj, targetURL);
	}
}

ccm_doShowPane = function(obj, targetURL) {
	// jump to the top of the page
	window.scrollTo(0,0);
	
	// loop through header nav items, turn them all off except our current one
	ccm_deactivateHeader(obj);

	ccm_deactivateSite(function() {;
		var wrappane = $("#ccm-page-detail");
		var conpane = $("#ccm-page-detail-content");
		ccm_hideMenus();
		ccm_hideHighlighter();
		ccm_topPaneTargetURL = targetURL;
		$(window).keypress(function(e) {
			if (e.keyCode == 27) {
				ccm_hidePane();
			}
		});
		
		$.ajax({
			type: 'GET',
			url: targetURL + "&random=" + (new Date().getTime()),
			success: function(msg) {
				conpane.html(msg);
				$("#ccm-page-detail-content .dialog-launch").dialog();			
				if (ccm_animEffects) {
					wrappane.fadeIn(60, function() {
						ccm_removeHeaderLoading();
					});
				} else {
					wrappane.show();
					ccm_removeHeaderLoading();
				}
			}
		});
	});
}

ccm_triggerSelectUser = function(uID, uName, uEmail) {
	alert(uID);
	alert(uName);
	alert(uEmail);
}

ccm_setupUserSearch = function() {
	$("#ccm-user-list-cb-all").click(function() {
		if ($(this).attr('checked') == true) {
			$('.ccm-list-record td.ccm-user-list-cb input[type=checkbox]').attr('checked', true);
			$("#ccm-user-list-multiple-operations").attr('disabled', false);
		} else {
			$('.ccm-list-record td.ccm-user-list-cb input[type=checkbox]').attr('checked', false);
			$("#ccm-user-list-multiple-operations").attr('disabled', true);
		}
	});
	$("td.ccm-user-list-cb input[type=checkbox]").click(function(e) {
		if ($("td.ccm-user-list-cb input[type=checkbox]:checked").length > 0) {
			$("#ccm-user-list-multiple-operations").attr('disabled', false);
		} else {
			$("#ccm-user-list-multiple-operations").attr('disabled', true);
		}
	});
	
	// if we're not in the dashboard, add to the multiple operations select menu

	$("#ccm-user-list-multiple-operations").change(function() {
		var action = $(this).val();
		switch(action) {
			case 'choose':
				var idstr = '';
				$("td.ccm-user-list-cb input[type=checkbox]:checked").each(function() {
					ccm_triggerSelectUser($(this).val(), $(this).attr('user-name'), $(this).attr('user-email'));
				});
				jQuery.fn.dialog.closeTop();
				break;
			case "properties": 
				uIDstring = '';
				$("td.ccm-user-list-cb input[type=checkbox]:checked").each(function() {
					uIDstring=uIDstring+'&uID[]='+$(this).val();
				});
				jQuery.fn.dialog.open({
					width: 630,
					height: 450,
					modal: false,
					href: CCM_TOOLS_PATH + '/users/bulk_properties?' + uIDstring,
					title: ccmi18n.properties				
				});
				break;				
		}
		
		$(this).get(0).selectedIndex = 0;
	});

	$("div.ccm-user-search-advanced-groups-cb input[type=checkbox]").unbind();
	$("div.ccm-user-search-advanced-groups-cb input[type=checkbox]").click(function() {
		$("#ccm-user-advanced-search").submit();
	});

}

ccm_triggerSelectGroup = function(gID, gName) {
	alert(gID);
	alert(gName);
}

ccm_setupGroupSearch = function() {
	$('div.ccm-group a').each(function(i) {
		var gla = $(this);
		$(this).click(function() {
			ccm_triggerSelectGroup(gla.attr('group-id'), gla.attr('group-name'));
			$.fn.dialog.closeTop();
			return false;
		});
	});	
	$("#ccm-group-search").ajaxForm({
		beforeSubmit: function() {
			$("#ccm-group-search-wrapper").html("");	
		},
		success: function(resp) {
			$("#ccm-group-search-wrapper").html(resp);	
		}
	});
	
	/* setup paging */
	$("div#ccm-group-paging a").click(function() {
		$("#ccm-group-search-wrapper").html("");	
		$.ajax({
			type: "GET",
			url: $(this).attr('href'),
			success: function(resp) {
				//$("#ccm-dialog-throbber").css('visibility','hidden');
				$("#ccm-group-search-wrapper").html(resp);
			}
		});
		return false;
	});
}

ccm_saveArrangement = function() {
	
	var serial = '';
	$('div.ccm-area').each(function() {
		areaStr = '&area[' + $(this).attr('id').substring(1) + '][]=';
		
		bArray = $(this).sortable('toArray');
		for (i = 0; i < bArray.length; i++ ) {
			if (bArray[i] != '' && bArray[i].substring(0, 1) == 'b') {
				// make sure to only go from b to -, meaning b28-9 becomes "28"
				var bID = bArray[i].substring(1, bArray[i].indexOf('-'));
				var bObj = $('#' + bArray[i]);
				bID += '-' + bObj.attr('custom-style');
				serial += areaStr + bID;
			}
		}
	});
	
 	$.ajax({
 		type: 'POST',
 		url: CCM_DISPATCHER_FILENAME,
 		data: 'cID=' + CCM_CID + '&ccm_token=' + CCM_SECURITY_TOKEN + '&btask=ajax_do_arrange' + serial,
 		success: function(msg) {
			$("div.ccm-area").removeClass('ccm-move-mode');
			$('div.ccm-block-arrange').each(function() {
				$(this).addClass('ccm-block');
				$(this).removeClass('ccm-block-arrange');
			});
			ccm_arrangeMode = false;
			$("li.ccm-main-nav-arrange-option").fadeOut(300, function() {
				$("li.ccm-main-nav-edit-option").fadeIn(300, function() {
					ccm_removeHeaderLoading();
				});
			});
 			ccmAlert.hud(ccmi18n.arrangeBlockMsg, 2000, 'up_down', ccmi18n.arrangeBlock);
 		}});
}

ccm_arrangeInit = function() {
	//$(document.body).append('<img src="' + CCM_IMAGE_PATH + '/topbar_throbber.gif" width="16" height="16" id="ccm-topbar-loader" />');
	
	ccm_arrangeMode = true;
	
	ccm_hideHighlighter();
	ccm_menuActivated = true;
	
	$('div.ccm-block').each(function() {
		$(this).addClass('ccm-block-arrange');
		$(this).removeClass('ccm-block');
	});
	
	ccm_setupHeaderMenu();
	$("li.ccm-main-nav-edit-option").fadeOut(300, function() {
		$("li.ccm-main-nav-arrange-option").fadeIn(300);
	});
	
	$("div.ccm-area").each(function() {
		$(this).addClass('ccm-move-mode');
		$(this).sortable({
			items: 'div.ccm-block-arrange',
			connectWith: $("div.ccm-area"),
			accept: 'div.ccm-block-arrange',
			opacity: 0.5
		});
	});
	
	$("a#ccm-nav-save-arrange").click(function() {
		ccm_saveArrangement();
	});
}

ccm_init = function() {
	ccm_setupHeaderMenu();
	// blink notification if it exists
	//$("#ccm-notification").fadeIn();
	$("a#ccm-nav-edit").click(function() {
		if (!ccm_topPaneDeactivated) {
			setTimeout(function() {
				// stupid safari? wtf?
				window.location.href = CCM_REL + '/index.php?cID=' + CCM_CID + '&ctask=check-out&ccm_token=' + CCM_SECURITY_TOKEN;
			}, 50);
		}
	});
	$("a#ccm-nav-add").click(function() {
		ccm_showPane(this, CCM_TOOLS_PATH + "/edit_collection_popup.php?ctask=add&cID=" + CCM_CID);
	});
}

ccm_selectSitemapNode = function(cID, cName) {
	alert(cID);
	alert(cName);
}

ccm_fadeInMenu = function(bobj, e) {
	var mwidth = bobj.width();
	var mheight = bobj.height();
	var posX = e.pageX + 2;
	var posY = e.pageY + 2;
	
	if ($(window).height() < e.clientY + mheight) {
		posY = e.pageY - mheight + 20;
	} else {
		posY = posY - 20;
	}
	
	if ($(window).width() < e.clientX + mwidth) {
		posX = e.pageX - mwidth + 15;
	} else {
		posX = posX - 15;
	}
	
	// the 15 and 20 is because of the way we're styling these menus
	
	bobj.css("top", posY + "px");
	bobj.css("left", posX + "px");
	
	if (ccm_animEffects) {
		bobj.fadeIn(60);
	} else {
		bobj.show();
	}
}

ccm_blockWindowClose = function() {
	jQuery.fn.dialog.closeTop();
	ccmValidateBlockForm = function() {return true;}
}

ccm_blockFormSubmit = function() {
	if (typeof window.ccmValidateBlockForm == 'function') {
		window.ccmValidateBlockForm();
		if (ccm_isBlockError) {
			if(ccm_blockError) {
				ccmAlert.notice(ccmi18n.error, '<ul><li>' + ccm_blockError + '</li></ul>');
			}
			ccm_resetBlockErrors();
			return false;
		}
	}
	return true;
}

ccm_setupGridStriping = function(tbl) {
	$("#" + tbl + " tr").removeClass();
	var j = 0;
	$("#" + tbl + " tr").each(function() {
		if ($(this).css('display') != 'none') {					
			if (j % 2 == 0) {
				$(this).addClass('ccm-row-alt');
			}
			j++;
		}
	});
}

ccm_headerMenuPreloads = function(){ 
	var ccmLoadingIcon = new Image();
	ccmLoadingIcon.src = CCM_IMAGE_PATH + "/icons/icon_header_loading.gif";
	
	var ccmHeaderImg = new Image();// preload image
	ccmHeaderImg.src = CCM_IMAGE_PATH + "/bg_header_active.png";
}

ccm_setupDashboardHeaderMenu = function(){	
	ccm_headerMenuPreloads();
	
	var helpEl=$("a#ccm-nav-dashboard-help");
	if(!helpEl || !helpEl.html()) return false;
	
	if(helpEl.attr('helpwaiting')==1) 
		setTimeout('ccm_support.helpPulse();',1500);
	helpEl.click(function() { 
		$(this).addClass('ccm-nav-loading'); 
		try{
			if($(this).attr('helpwaiting')==1) 
				 ccm_support.showMyTickets();
			else ccm_support.show();
		}catch(e){alert(e.message);}
		return false;
	});		
}

ccm_dashboardRequestRemoteInformation = function() {
	$.get(CCM_TOOLS_PATH + '/dashboard/get_remote_information');
}

ccm_getMarketplaceItem = function(mpID, closeTop) {
	if (closeTop) {
		jQuery.fn.dialog.closeTop(); // this is here due to a weird safari behavior
	}
	jQuery.fn.dialog.showLoader();
	// first, we check our local install to ensure that we're connected to the
	// marketplace, etc..
	params = {'mpID': mpID};
	$.getJSON(CCM_TOOLS_PATH + '/marketplace/connect', params, function(resp) {
		jQuery.fn.dialog.hideLoader();
		if (resp.isConnected) {
			if (resp.purchaseRequired) {
				alert("buy it foo");			
			} else {
				alert('download');		
			}

		} else {
			$.fn.dialog.open({
				title: ccmi18n.community,
				href:  CCM_TOOLS_PATH + '/marketplace/frame?mpID=' + mpID,
				width: '90%',
				modal: false,
				height: '70%',
			});
		}
	});
}

ccm_setupHeaderMenu = function() {
	
	ccm_headerMenuPreloads();

	$("ul#ccm-main-nav a").click(function() {
		if (!ccm_topPaneDeactivated) {
			$(this).addClass('ccm-nav-loading');
		}
	});
	$("ul#ccm-system-nav a").click(function() {
		$(this).addClass('ccm-nav-loading');
	});
	$("a#ccm-nav-dashboard").click(function() {
		var dash = $(this).attr('href');
		setTimeout(function() {
			// stupid safari? wtf?
			window.location.href = dash;
		}, 50);
		
	});
	
	var helpEl=$("a#ccm-nav-help");
	if(helpEl.attr('helpwaiting')==1) 
		setTimeout('ccm_support.helpPulse()',1500);
	helpEl.click(function() { 
		$(this).addClass('ccm-nav-loading'); 
		if($(this).attr('helpwaiting')==1) 
			 ccm_support.showMyTickets();
		else ccm_support.show();
	});	
	
	$("a#ccm-nav-logout").click(function() {
		var href = $(this).attr('href');
		setTimeout(function() {
			// stupid safari? wtf?
			window.location.href = href;
		}, 50);
		
	});
	
}

ccm_removeHeaderLoading = function() {
	$("a.ccm-nav-loading").removeClass('ccm-nav-loading');
}

ccm_showBreadcrumb = function() {
/*$("#ccm-bc").animate({
	top: '50x',
	}, {
		duration: 200,
		easing: 'easeInBounce'
	});*/
	$("#ccm-bc").show();
	$("#ccm-bc").css('top', '49px');
}

ccm_hideBreadcrumb = function() {
	/*
	$("#ccm-bc").animate({
	top: '0px',
	}, {
		duration: 200,
		easing: 'easeOutQuad'
	});*/
	$("#ccm-bc").css('top', '0px');
	$("#ccm-bc").hide();
	ccm_bcEnabled = false;

}

ccm_setupBreadcrumb = function() {
	
	if ($("#ccm-bc").get().length > 0) {
		$("#ccm-page-controls").mouseover(function() {
			if (ccm_siteActivated) { 
				if (!ccm_bcEnabled) {
					ccm_showBreadcrumb();
				}
				ccm_bcEnabled = true;
			}
		});
		$("#ccm-bc").mouseover(function() {
			ccm_bcEnabled = true;
			if (ccm_bcEnabledTimer) {
				clearTimeout(ccm_bcEnabledTimer);
				ccm_bcEnabledTimer = false;
			}
		});
		$("#ccm-bc").mouseout(function() {
			ccm_bcEnabled = false;
			ccm_bcEnabledTimer = setTimeout(function() {
				if (!ccm_bcEnabled) {
					ccm_hideBreadcrumb();
				}
			}, 500);
		});
	}
}

/** 
 * JavaScript localization. Provide a key and then reference that key in PHP somewhere (where it will be translated)
 */
ccm_t = function(key) {
	return $("input[name=ccm-string-" + key + "]").val();
}

$(function() {
	
	b1 = new Image();// preload image
	b1.src = CCM_IMAGE_PATH + "/button_l.png";
	b2 = new Image();// preload image
	b2.src = CCM_IMAGE_PATH + "/button_l_active.png";
	b3 = new Image();// preload image
	b3.src = CCM_IMAGE_PATH + "/button_r.png";
	b4 = new Image();// preload image
	b4.src = CCM_IMAGE_PATH + "/button_r_active.png";
	b5 = new Image();// preload image
	b5.src = CCM_IMAGE_PATH + "/button_scroller_l_active.png";
	b6 = new Image();// preload image
	b6.src = CCM_IMAGE_PATH + "/button_scroller_r_active.png";
	
	// menu assets
	m1 = new Image();// preload image
	m1.src = CCM_IMAGE_PATH + "/bg_menu_rb.png";
	m2 = new Image();// preload image
	m2.src = CCM_IMAGE_PATH + "/bg_menu_b.png";
	m3 = new Image();// preload image
	m3.src = CCM_IMAGE_PATH + "/bg_menu_lb.png";
	m4 = new Image();// preload image
	m4.src = CCM_IMAGE_PATH + "/bg_menu_r.png";
	m5 = new Image();// preload image
	m5.src = CCM_IMAGE_PATH + "/bg_menu_l.png";
	m6 = new Image();// preload image
	m6.src = CCM_IMAGE_PATH + "/bg_menu_rt.png";
	m7 = new Image();// preload image
	m7.src = CCM_IMAGE_PATH + "/bg_menu_t.png";
	m8 = new Image();// preload image
	m8.src = CCM_IMAGE_PATH + "/bg_menu_lt.png";

	if ($.browser.msie) {
		ccm_animEffects = false;
	} else {
		ccm_animEffects = true;
	}


});
 

//make sure the user isn't using internet explorer 6
/*
$(function(){
	if( $.browser.msie ){
		var versionParts = jQuery.browser.version.split('.'); 
		if( parseInt(versionParts[0])==6 ) 
			alert( ccmi18n.noIE6 );
	}
});
*/

/* Block Styles Customization Popup */
var ccmCustomStyle = {   
	tabs:function(aLink,tab){
		$('.ccm-styleEditPane').hide();
		$('#ccm-styleEditPane-'+tab).show();
		$(aLink.parentNode.parentNode).find('li').removeClass('ccm-nav-active');
		$(aLink.parentNode).addClass('ccm-nav-active');
		return false;
	},
	resetAll:function(){
		if (!confirm( ccmi18n.confirmCssReset)) {
			return false;
		}
		jQuery.fn.dialog.showLoader();

		$('#ccm-reset-style').val(1);
		$('#ccmCustomCssForm').get(0).submit();
		return true;
	},
	showPresetDeleteIcon: function() {
		if ($('select[name=cspID]').val() > 0) {
			$("#ccm-style-delete-preset").show();		
		} else {
			$("#ccm-style-delete-preset").hide();
		}	
	},
	deletePreset: function() {
		var cspID = $('select[name=cspID]').val();
		if (cspID > 0) {
			var action = $('#ccm-custom-style-refresh-action').val() + '&deleteCspID=' + cspID + '&subtask=delete_custom_style_preset';
			jQuery.fn.dialog.showLoader();
			
			$.get(action, function(r) {
				$("#ccm-custom-style-wrapper").html(r);
				jQuery.fn.dialog.hideLoader();
			});
		}
	},
	initForm: function() {
		if ($("#cspFooterPreset").length > 0) {
			$("#ccmCustomCssFormTabs input, #ccmCustomCssFormTabs select").bind('change click', function() {
				$("#cspFooterPreset").show();
				$("#cspFooterNoPreset").hide();
				$("#ccmCustomCssFormTabs input, #ccmCustomCssFormTabs select").unbind('change click');
			});		
		}
		$('input[name=cspPresetAction]').click(function() {
			if ($(this).val() == 'create_new_preset' && $(this).attr('checked')) {
				$('input[name=cspName]').attr('disabled', false);
				$('input[name=cspName]').focus();
			} else {
				$('input[name=cspName]').val('');
				$('input[name=cspName]').attr('disabled', true);
			}
		});
		ccmCustomStyle.showPresetDeleteIcon();
		$('select[name=cspID]').change(function() {
			var cspID = $(this).val();
			var selectedCsrID = $('input[name=selectedCsrID]').val();
			
			jQuery.fn.dialog.showLoader();
			if (cspID > 0) {
				var action = $('#ccm-custom-style-refresh-action').val() + '&cspID=' + cspID;
			} else {
				var action = $('#ccm-custom-style-refresh-action').val() + '&csrID=' + selectedCsrID;
			}
			
			
			$.get(action, function(r) {
				$("#ccm-custom-style-wrapper").html(r);
				jQuery.fn.dialog.hideLoader();
			});
			
		});
		
		$('#ccmCustomCssForm').submit(function() {
			if ($('input[name=cspCreateNew]').attr('checked') == true) {
				if ($('input[name=cspName]').val() == '') { 
					$('input[name=cspName]').focus();
					alert(ccmi18n.errorCustomStylePresetNoName);
					return false;
				}
			}

			jQuery.fn.dialog.showLoader();		
			return true;
		});
	},
	validIdCheck:function(el,prevID){
		var selEl = $('#'+el.value); 
		if( selEl && selEl.get(0) && selEl.get(0).id!=prevID ){		
			$('#ccm-styles-invalid-id').css('display','block');
		}else{
			$('#ccm-styles-invalid-id').css('display','none');
		}
	}
}

/* SUPPORT SECTION */

var ccm_support = {    
	
	show:function(){ 
		//alert(helpurl);
		var supportWrap=document.getElementById('ccm-supportWrap');
		//load into existing window, if help is already open
		if(supportWrap){ 
			$.ajax({
				type: 'GET',
				url: CCM_TOOLS_PATH + '/support/search.php', 
				success: function(resp) {
					var supportWrap=document.getElementById('ccm-supportWrap');
					if(!supportWrap) return false;
					$(supportWrap.parentNode).html(resp); 
					ccm_removeHeaderLoading();
					//setTimeout('ccm_support.checkedLogged()',500);
				}	
			});
		}else{
			this.dialog(CCM_TOOLS_PATH + '/support/search/');
		}		
	},
	
	dialog:function(url){
		$.fn.dialog.open({
			title: ccmi18n.helpPopup,
			href:  url,
			width: 550,
			modal: false,
			height: 400,
			onLoad:function(){ 				
			},
			onOpen:function(){ 
				ccm_removeHeaderLoading();
			}
		});
	},
	
	isLoggedIn:0,
	isLogged:function(){
		var el=$('#ccm-isRemotelyLogged');		
		if(el && el.get(0)){
			this.isLoggedIn=parseInt(el.val());
		}
		return this.isLoggedIn;
	},
	
	signOut:function(closeFn){
		$.ajax({
			type: 'GET',
			url: CCM_TOOLS_PATH + '/support/auth/?logout=1', 
			success: function() {
				ccm_support.isLoggedIn=0;
				if (typeof closeFn == 'function') {
					closeFn();
				}
			}	
		});	
	}, 
	searchAnswers:function(form){
		this.showLoading();
		try{  
			//$("#ccm-dialog-throbber").css('visibility', 'visible');
			$.ajax({
				type: 'POST',
				url: CCM_TOOLS_PATH + '/support/search/',
				data: $(form).formSerialize(),
				success: function(resp) {
					ccm_support.hideLoading();
					var supportWrap=document.getElementById('ccm-supportWrap');
					if(!supportWrap) return false;
					$(supportWrap.parentNode).html(resp); 
				}		
			});
		}catch(e){
			alert('Error in ccm_support.askQuestion(): '+e.message);
		}
		return false;
	},
	
	showMyTickets:function(){
		this.showLoading();
		var supportWrap=document.getElementById('ccm-supportWrap');
		//load into existing window, if help is already open
		if(supportWrap){
			if( !ccm_support.isLogged() ){
				ccm_support.login(function(){
						ccm_support.isLoggedIn=1;
						$('#ccm-isRemotelyLogged').remove();
						ccm_support.showMyTickets();
					});
				return;
			}			
			$.ajax({
				type: 'GET',
				url: CCM_TOOLS_PATH + '/support/tickets/',
				success: function(resp) {
					ccm_support.hideLoading();
					var supportWrap=document.getElementById('ccm-supportWrap');
					if(!supportWrap) return false;
					$(supportWrap.parentNode).html(resp); 
					ccm_removeHeaderLoading();
				}		
			});
		}else{ 
			this.dialog(CCM_TOOLS_PATH + '/support/tickets/');
		}		
	},
	
	login:function(loggedInFunc){
		if(typeof(loggedInFunc)!='function'){
			loggedInFunc=function(){
				ccm_support.isLoggedIn=1;
				$('#ccm-isRemotelyLogged').remove();
				ccm_support.showQuestionForm() 
			}
		}
		ccmPopupLogin.show( '', loggedInFunc, 'ccm-supportWrap', 1, function(){ 
				var plm=$('#ccm-popupLoginIntroMsg');
				plm.css('display','block');
				plm.css('margin-top','8px');
				plm.css('margin-bottom','16px');
				plm.html(ccmi18n.helpPopupLoginMsg);
			});
	},
	
	showQuestionForm:function(){
		this.showLoading();	
		if( !ccm_support.isLogged() ){
			ccm_support.login();
			return;
		}
		$.ajax({
			type: 'POST',
			url: CCM_TOOLS_PATH + '/support/post/?pg_url='+encodeURIComponent(window.location),
			success: function(resp) {
				ccm_support.hideLoading();
				var supportWrap=document.getElementById('ccm-supportWrap');
				if(!supportWrap) return false;
				$(supportWrap.parentNode).html(resp); 
			}		
		});
	},
	
	submitNewQuestion:function(form){ 
		this.showLoading();
		try{
			$.ajax({
				type: 'POST',
				url: CCM_TOOLS_PATH + '/support/post/',
				data: $(form).formSerialize(),
				success: function(resp) {
					ccm_support.hideLoading();
					var supportWrap=document.getElementById('ccm-supportWrap');
					if(!supportWrap) return false;
					$(supportWrap.parentNode).html(resp); 
				}		
			});
		}catch(e){
			alert('Error in ccm_support.submitNewQuestion(): '+e.message);
		}
		return false;
	},
	
	showLoading:function(){
		$('#ccm-supportWrap .ccm-throbber').css('display','block');
	},
	
	hideLoading:function(){
		$('#ccm-supportWrap .ccm-throbber').css('display','none');
	},
	
	helpIconOrigImg:'',
	helpIconOrigClr:'',
	helpPulse:function(){
		var el=document.getElementById('ccm-nav-help');
		if(!el) el=document.getElementById('ccm-nav-dashboard-help'); 
		el=$(el);
		this.helpIconOrigClr=el.css('background-color');
		
		el.css('background-color','#fafafa');
		el.animate({backgroundColor:"#ffa"},'','',function(){
		}).animate({backgroundColor:"#fafafa"},'','',function(){
		}).animate({backgroundColor:"#ffa"},'','',function(){
		}).animate({backgroundColor:"#fafafa"},'','',function(){					
		}).animate({backgroundColor:"#ffa"},'','',function(){
		}).animate({backgroundColor:"#fafafa"},'','',function(){
		}).animate({backgroundColor:"#ffa"},'','',function(){
		}).animate({backgroundColor:"#fafafa"},'','',function(){
		}).animate({backgroundColor:"#ffa"},'','',function(){			
		}).animate({backgroundColor:"#fafafa"},'','',function(){
			$(this).css('background-color',ccm_support.helpIconOrigClr);	 
		}); 		
	}
}
