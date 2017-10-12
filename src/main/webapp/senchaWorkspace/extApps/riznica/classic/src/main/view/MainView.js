Ext.define('riznica.main.view.MainView', {
  extend: 'Ext.container.Container',
  xtype: 'main-view-MainView',

  requires: [
    'Ext.container.Container',
    'Ext.layout.container.Border',
    'Ext.layout.container.Fit',
    'Ext.layout.container.HBox',
    'Ext.layout.container.VBox',
    'Ext.menu.Separator',
    'Ext.plugin.Responsive',
    // Note: If main view is not a viewport, than Ext.plugin.Viewport must be imported.
    'Ext.plugin.Viewport',
    'Ext.toolbar.Toolbar',
    'Ext.ux.TabCloseMenu',
    'Ext.ux.TabReorderer',
    'Ext.ux.TabCloseOnMiddleClick',
    'grich.core.component.DynamicTabPanelContainer',
    'grich.core.component.SecurableTreeList',
    'riznica.core.view.TreeToolbarView',
    'riznica.main.view.MainViewController',
    'riznica.main.view.MainViewModel',
    'grich.core.component.NotificationHideablePlugin'
  ],

  controller: 'main-view-MainViewController',
  viewModel: {
    type: 'main-view-MainViewModel'
  },

  listeners: {
    render: 'onMainViewRender'
  },

  i18n: {
    languageText: 'Language',
    themeText: 'Theme',
    administrationText: 'Administration',
    aboutText: 'About',
    signOutText: 'Sign Out'
  },

  layout: {
    type: 'border',
    regionWeights: {
      west: 100, north: 50, east: 100, south: 50
    }
  },

  config: {
    topToolbarHeight: 150,
    homeAutoNavigate: true,
  },

  initComponent: function() {
    var me = this;
    riznica.main.view.MainViewUtils.uploadDocument = null;
    var i, arrayLength;
    var radioGroupValue = "category";

    //noinspection JSUnresolvedFunction
    var topToolbarHeight = me.getTopToolbarHeight();

    var imageWidth = 40;
    var languageMenu = [];
    //noinspection JSUnresolvedVariable
    var localeCodeSupportedList = riznica.configuration.localeCodeSupportedList;
    //noinspection JSUnresolvedVariable
    var localeCodeNameMapping = riznica.configuration.localeCodeNameMapping;
    //noinspection JSUnresolvedVariable
    var currentLocaleCode = riznica.configuration.localeCodeCurrent;
    var localeCode, languageName, languageNativeName, isCurrentLocaleCode = false, menuItem;
    var themeMenu = [];
    //noinspection JSUnresolvedVariable
    var supportedThemeList = riznica.configuration.suportedThemeList;
    //noinspection JSUnresolvedVariable
    var currentTheme = riznica.configuration.currentTheme;
    //noinspection JSUnresolvedVariable
    var appNameLong = riznica.configuration.appNameLong;
    var topLevelNavigationTreeStoreId = 'main.store.TopLevelNavigationTreeStore';

    var themeName, themeDisplayName, isCurrentTheme;


    // construct language menu -- start
    arrayLength = localeCodeSupportedList.length;
    for (i = 0; i < arrayLength; i++) {
      localeCode = localeCodeSupportedList[i];
      languageName = localeCodeNameMapping[localeCode].name;

      //noinspection JSUnresolvedVariable
      languageNativeName = localeCodeNameMapping[localeCode].nativeName;

      isCurrentLocaleCode = currentLocaleCode === localeCode;
      menuItem = {
        group: 'languages',
        text: languageNativeName + ' (' + languageName + ')',
        checked: isCurrentLocaleCode,
        localeCode: localeCode,
        checkHandler: 'onLanguageChange'
      };

      languageMenu.push(menuItem);
    }
    // construct language menu -- end

    // construct theme menu -- start
    arrayLength = supportedThemeList.length;
    for (i = 0; i < arrayLength; i++) {
      themeName = supportedThemeList[i];
      isCurrentTheme = themeName === currentTheme;
      themeDisplayName = Ext.String.capitalize(themeName);

      menuItem = {
        group: 'themes',
        text: themeDisplayName,
        checked: isCurrentTheme,
        themeName: themeName,
        checkHandler: 'onThemeChange'
      };

      themeMenu.push(menuItem);
    }
    // construct theme menu -- end

    Ext.applyIf(me, {
      items: [
        {
          region: 'north', cls: 'main-view-north-region',
          xtype: 'container', height: topToolbarHeight,
          layout: { type: 'vbox', align: 'stretch' },
          items: [
            {
              xtype: 'container', flex: 1, border: 1,
              style: 'margin: 0px 10px 0px 10px',
              layout: { type: 'hbox', align: 'middle' },
              items: [
                { xtype: 'component', html: 'Addiko: Blog', cls: 'app-header-view-title-text' },
                { xtype: 'component', border: false, flex: 1 },
                {
                  xtype: 'box', style: { textAlign: 'right', marginRight: '10px' },
                  html: '<strong>Korisnik:</strong> ' + riznica.configuration.security.userName
                }
              ]
            },
            {

              xtype: 'container', flex: 1,
              layout: { type: 'hbox', align: 'middle' },
              style: 'margin: 5px 10px 5px 5px',
              items: [
                {   //radiobutton-search filter
                  xtype: 'fieldcontainer',
                  itemId: 'radioId',
                  fieldLabel: 'Search post by',
                  defaultType: 'radiofield',
                  defaults: {
                    flex: 1
                  },
                  layout: 'hbox',

                  items: [
                    {
                      //on click category radio button,search post by category
                      boxLabel: 'Category',
                      name: 'group',
                      checked: true,
                      id: 'radio1',
                      margin: "0px 5px 5px 0px",
                      listeners: {
                        change: function(thisEl, newValue, oldValue) {
                          var rb1 = Ext.getCmp('radio1');
                          if (rb1.getValue()) {
                            radioGroupValue = "category";
                            var searchFieldValue = me.down('#searchTextField').getValue();
                            me.getController().searchOnChange(radioGroupValue, searchFieldValue);
                          }
                        }
                      }

                    }, {
                      //on click title radio button,search post by title
                      boxLabel: 'Title',
                      name: 'group',
                      id: 'radio2',
                      margin: "0px 5px 5px 0px",
                      listeners: {
                        change: function() {
                          var rb1 = Ext.getCmp('radio2');
                          if (rb1.getValue()) {
                            radioGroupValue = "title";
                            var searchFieldValue = me.down('#searchTextField').getValue();
                            me.getController().searchOnChange(radioGroupValue, searchFieldValue);
                          }
                        }
                      }
                    }
                    // {
                    //     boxLabel: 'Date',
                    //     name: 'group',
                    //     id: 'radio3',
                    //     margin: "0px 5px 5px 0px",
                    //     listeners:{
                    //         change:function () {
                    //             var rb1 = Ext.getCmp('radio1');
                    //             if(rb1.getValue()) {
                    //
                    //             }
                    //         }
                    //     }
                    //
                    // }
                    , {
                      //on click author radio button,search post by author
                      boxLabel: 'Author',
                      name: 'group',
                      id: 'radio3',
                      margin: "0px 5px 5px 0px",
                      listeners: {
                        change: function() {
                          var rb1 = Ext.getCmp('radio3');
                          if (rb1.getValue()) {
                            radioGroupValue = "author";
                            var searchFieldValue = me.down('#searchTextField').getValue();
                            me.getController().searchOnChange(radioGroupValue, searchFieldValue);
                          }
                        }
                      }

                    }
                  ]


                },


                {
                  xtype: 'container',
                  flex: 4


                },
                //upload image
                { xtype:'fileuploadfield',
                  title: 'Upload file',
                  width: 400,
                  bodyPadding: 10,
                  style:"margine 50px 20px 10px 5px",
                  frame: true,
                  renderTo: Ext.getBody(),
                  items: [{
                    xtype: 'filefield',
                    name: 'photo',
                    fieldLabel: 'Photo',
                    labelWidth: 50,
                    msgTarget: 'side',
                    allowBlank: false,
                    anchor: '100%',
                    buttonText: 'Select file...'
                  }],
                  listeners: {
                    change: function() {
                      // var title = this.up('form').down('#productTitle').getValue();
                      // var title = this.up().up().getStore();
                      // var path = this.getValue();
                      // var name = this.getValue().replace(/^.*[\\\/]/, '');
                      var file = this.getEl().down('input[type=file]').dom.files[0];

                      var fileReader = new FileReader();
                      fileReader.addEventListener("load", function() {

                       // var record = Ext.create("riznica.product.model.DocumentModel",
                         // { image: fileReader.result });
                        riznica.main.view.MainViewUtils.uploadDocument = fileReader.result;
                      }, false);

                      if (file != null) {
                        fileReader.readAsDataURL(file);
                      }
                    },
                    afterrender: function(cmp) {
                      cmp.fileInputEl.set({
                        accept: 'image/*,application/pdf'
                      });
                    }
                  }
                },
                {
                  //add new post
                  xtype: 'button',
                  text: "Send file",
                  margin: '5 5 5 5',
                  listeners: {
                    //on click listener -add new post button
                    click: "sendImage"
                  }
                },
                {
                  //add new post
                  xtype: 'button',
                  text: "Get file",
                  margin: '5 5 5 5',
                  listeners: {
                    //on click listener -add new post button
                    click: "getImage"
                  }

                },
                {
                  //add new post
                  xtype: 'button',
                  text: "New order",
                  margin: '5 5 5 5',
                  listeners: {
                    //on click listener -add new post button
                    click: "newOrder"
                  }

                },
                {
                  //add new post
                  xtype: 'button',
                  text: "Add new post",
                  margin: "5 5 5 5",
                  listeners: {
                    //on click listener -add new post button
                    click: "addNewPost"
                  }

                },
                {
                  //adding new User
                  xtype: 'button',
                  text: "Add new user",
                  margin: "5 5 5 5",
                  handler: "onClickAddUser",
                  align: "right"
                },
                //unused tree tool bar
                //  {
                //   xtype: 'core-view-TreeToolbarView',
                //   storeId: topLevelNavigationTreeStoreId,
                //   flex: 1
                // },
                {
                  xtype: 'toolbar',
                  style: 'background-color: transparent !important; ',
                  items: [
                    {
                      iconCls: 'x-fa fa-cog',
                      menu: [
                        {
                          iconCls: 'x-fa fa-language',
                          text: me.i18n.languageText || 'Language',
                          menu: languageMenu
                        },
                        {
                          iconCls: 'x-fa fa-paint-brush',
                          text: me.i18n.themeText || 'Theme',
                          menu: themeMenu
                        },
                        {
                          iconCls: 'x-fa fa-info',
                          text: me.i18n.aboutText || 'About',
                          handler: 'onAbout'
                        },
                        {
                          xtype: 'menuseparator',
                          plugins: [{
                            ptype: 'grich.core.component.Securable',
                            authorityList: ['ROLE_ADMIN']
                          }]
                        },
                        {
                          iconCls: 'x-fa fa-wrench',
                          text: me.i18n.administrationText || 'Administration',
                          handler: 'onAdministration',
                          plugins: [{
                            ptype: 'grich.core.component.Securable',
                            authorityList: ['ROLE_ADMIN']
                          }]
                        },
                        { xtype: 'menuseparator' },
                        {
                          iconCls: 'x-fa fa-sign-out',
                          text: me.i18n.signOutText || 'Sign Out',
                          handler: 'onSignOut'
                        }
                      ]
                    }
                  ]
                }

              ]
            },
            {
              xtype: 'container', flex: 1,
              layout: { type: 'hbox', align: 'middle' },
              style: 'margin: 5px 5px 5px 5px',
              items: [{
                //search field
                xtype: 'textfield',
                // fieldLabel: "Search",
                width: 380,
                itemId: 'searchTextField',
                // flex: 1,
                listeners: {
                  change: function(thisEl, newValue, oldValue) {
                    me.getController().searchOnChange(radioGroupValue, newValue);
                  }
                }
              }

              ]

            }


          ]
        },
        {
          reference: 'mainTabPanelContainer',
          xtype: 'grich-core-component-DynamicTabPanelContainer',
          region: 'center',
          padding: 5,

          // Hide any displayed GrichNotifications when tabs change or when all tabs are closed.
          plugins: [{
            ptype: 'grich.core.component.NotificationHideable',
            hideNotificationOnEventList: ['tabchange', 'allTabsClosed']
          }],
          scrollable: true,
          title: 'Main content',
          header: false, // title and header: false are used to satisfy aria requirements and to suppress aria related warning from Ext JS
          listeners: {
            tabchange: 'onMainTabPanelTabChange',
            allTabsClosed: 'onMainTabPanelAllTabsClosed'
          },
          tabPanelConfig: {
            plugins: [{ ptype: 'tabclosemenu' }, { ptype: 'tabreorderer' }, { ptype: 'TabCloseOnMiddleClick' }]
          },

          items: [
            {
              layout: "border",
              defaults: {
                xtype: "panel"
              },
              items: [{
                //categories
                title: "Category",
                flex: 1,
                region: "west",
                width: 100,
                collapsible: true,
                split: true,
                items: [
                  //Blog categories
                  {
                    //category view
                    xtype: 'category-view-category',
                    itemId: 'category-view-id'

                  }

                ]
              },
                {
                  items: [{
                    layout: { type: 'vbox' },
                    items: [
                      {
                        //grid panel with recently added posts
                        xtype: 'panel',
                        width: "100%",
                        title: "Recent posts",
                        height: 400,
                        scrollable: true,
                        flex: 1,
                        items: [{
                          xtype: 'post-view-post'
                        }
                        ],
                        tools: [
                          {
                            xtype: 'button',
                            iconCls: "x-fa fa-refresh",
                            // iconAlign: 'right',
                            handler: function() {
                              Ext.ComponentQuery.query("#post-view-postId")[0].getStore().load();
                            }
                          }
                        ]

                      },
                      {
                       //xtype:'order-OrderSearchView',
                       xtype:'order-view-grid',width:"100%",title:'Orders'

                      }
                                         ],
                    region: "center"

                  }],
                  flex: 4,
                  region: "center"


                }
              ]
            }
          ]
        }]
    });

    me.callParent();
  }
});
