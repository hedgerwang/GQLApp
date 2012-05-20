/**
 * @fileOverview Scene
 * @author Hedger Wang
 */

var BaseUI = require('jog/ui/baseui').BaseUI;
var Class = require('jog/class').Class;
var cssx = require('jog/cssx').cssx;
var dom = require('jog/dom').dom;

var Jewel = Class.create(BaseUI, {


  /** @override */
  createNode: function() {
    var node = dom.createElement(
      'div', cssx('app-ui-jewel'),
      [ 'div', cssx('app-ui-jewel_center'),
        ['div', cssx('app-ui-jewel_freind-requests ') + ' ' +
          cssx('app-ui-jewel_icon')
        ],
        ['div', cssx('app-ui-jewel_inbox') + ' ' +
          cssx('app-ui-jewel_icon')
        ],
        ['div', cssx('app-ui-jewel_notification') + ' ' +
          cssx('app-ui-jewel_icon')
        ]
      ]
    );
    return node;
  },

  /** @override */
  onDocumentReady:function() {
   
  }
});


exports.Jewel = Jewel;