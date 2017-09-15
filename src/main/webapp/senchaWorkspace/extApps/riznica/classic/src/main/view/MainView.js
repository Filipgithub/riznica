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
        topToolbarHeight: 80,
        homeAutoNavigate: true
    },

    initComponent: function () {
        var me = this;
        var i, arrayLength;

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
                    layout: {type: 'vbox', align: 'stretch'},
                    items: [
                        {
                            xtype: 'container', flex: 1, border: 1,
                            style: 'margin: 0px 10px 0px 10px',
                            layout: {type: 'hbox', align: 'middle'},
                            items: [
                                {xtype: 'component', html: 'Addiko: Test', cls: 'app-header-view-title-text'},
                                {xtype: 'component', border: false, flex: 1},
                                {
                                    xtype: 'box', style: {textAlign: 'right', marginRight: '10px'},
                                    html: '<strong>Korisnik:</strong> ' + riznica.configuration.security.userName
                                }
                            ]
                        },
                        {
                            xtype: 'container', flex: 1,
                            layout: {type: 'hbox', align: 'middle'},
                            style: 'margin: 0px 10px 0px 10px',
                            items: [
                                {
                                    //search field
                                    xtype: 'textfield',
                                    fieldLabel: "Search",
                                    width: 180,
                                    flex: 1,
                                    listeners: {change: 'searchOnChange'}

                                }
                                ,

                                {
                                    xtype: 'container',
                                    flex: 4


                                },
                                {
                                    //adding new User
                                    xtype: 'button',
                                    text: "Add new user",
                                    style: "margin 0px 0px 0px 0px",
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
                                                {xtype: 'menuseparator'},
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
                        plugins: [{ptype: 'tabclosemenu'}, {ptype: 'tabreorderer'}, {ptype: 'TabCloseOnMiddleClick'}]
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
                                        layout: {type: 'vbox'},
                                        items: [
                                            {
                                                //panel for posts
                                                xtype: 'panel',
                                                itemId: 'formId',
                                                layout: {type: 'hbox'},
                                                //buttons add remove for posts
                                                items: [
                                                    {
                                                        //add new post
                                                        xtype: 'button',
                                                        text: "Add new post",
                                                        style: 'margin: 0px 0px 5px 0px',
                                                        listeners: {
                                                            //on click listener -add new post button
                                                            click: "addNewPost"
                                                        }

                                                    }


                                                ]


                                            },
                                            {
                                                //grid panel with recently added posts
                                                xtype: 'panel',
                                                width: "100%",
                                                title: "Recent posts",
                                                items: [{
                                                    xtype: 'post-view-post'
                                                }
                                                ]

                                            }],
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
