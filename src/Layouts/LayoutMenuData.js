import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Import Icons
import FeatherIcon from "feather-icons-react";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isApps, setIsApps] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);

  // Pages
  const [isLanding, setIsLanding] = useState(false);
  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }

    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState === "Landing") {
      setIsLanding(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
  ]);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboards",
      icon: <FeatherIcon icon="home" className="icon-dual" />,
      link: "/dashboard",
      stateVariables: isDashboard,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
    },
    {
      label: "Master Data",
      isHeader: true,
    },
    {
      id: "apps",
      label: "Category Management",
      icon: <FeatherIcon icon="grid" className="icon-dual" />,
      link: "/category-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
    {
      id: "branchManagement",
      label: "Branch Management",
      icon: <FeatherIcon icon="archive" className="icon-dual" />,
      link: "/branch-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
    {
      id: "serviceManagement",
      label: "Service Management",
      icon: <FeatherIcon icon="layers" className="icon-dual" />,
      link: "/service-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
    {
      id: "OffersManagement",
      label: "Offers Management",
      icon: <FeatherIcon icon="thumbs-up" className="icon-dual" />,
      link: "/offer-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
    {
      label: "Pages",
      isHeader: true,
    },
    {
      id: "apps",
      label: "Products",
      icon: <FeatherIcon icon="codesandbox" className="icon-dual" />,
      link: "/product-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
    {
      id: "orderManagement",
      label: "Order Management",
      icon: <FeatherIcon icon="shopping-cart" className="icon-dual" />,
      link: "/",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
      subItems: [
        {
          id: "dingInOrder",
          label: "Dinging Order",
          icon: <FeatherIcon icon="grid" className="icon-dual" />,
          link: "/dinging-order-management",
          click: function (e) {
            e.preventDefault();
            setIsApps(!isApps);
            setIscurrentState("Apps");
            updateIconSidebar(e);
          },
          stateVariables: isApps,
        },
        {
          id: "deliveryOrder",
          label: "Delivery Order",
          icon: <FeatherIcon icon="users" className="icon-dual" />,
          link: "/delivery-order-management",
          click: function (e) {
            e.preventDefault();
            setIsApps(!isApps);
            setIscurrentState("Apps");
            updateIconSidebar(e);
          },
          stateVariables: isApps,
        },
      ],
    },
    {
      id: "reservationManagement",
      label: "Table Reservations",
      icon: <FeatherIcon icon="bookmark" className="icon-dual" />,
      link: "/reservation-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },

    {
      id: "apps",
      label: "Payment Management",
      icon: <FeatherIcon icon="dollar-sign" className="icon-dual" />,
      link: "/",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
      subItems: [
        {
          id: "paymentManagement",
          label: "Order Payments",
          icon: <FeatherIcon icon="grid" className="icon-dual" />,
          link: "/payment-management",
          click: function (e) {
            e.preventDefault();
            setIsApps(!isApps);
            setIscurrentState("Apps");
            updateIconSidebar(e);
          },
          stateVariables: isApps,
        },
        {
          id: "reservationPaymentManagement",
          label: "Reservation Payments",
          icon: <FeatherIcon icon="users" className="icon-dual" />,
          link: "/reservation-payment-management",
          click: function (e) {
            e.preventDefault();
            setIsApps(!isApps);
            setIscurrentState("Apps");
            updateIconSidebar(e);
          },
          stateVariables: isApps,
        },
      ],
    },
    {
      id: "apps",
      label: "Gallery Management",
      icon: <FeatherIcon icon="image" className="icon-dual" />,
      link: "/gallery-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
    {
      id: "userManagement",
      label: "Users Management",
      icon: <FeatherIcon icon="users" className="icon-dual" />,
      link: "/",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
      subItems: [
        {
          id: "staffManagement",
          label: "Staff Management",
          icon: <FeatherIcon icon="grid" className="icon-dual" />,
          link: "/staff-management",
          click: function (e) {
            e.preventDefault();
            setIsApps(!isApps);
            setIscurrentState("Apps");
            updateIconSidebar(e);
          },
          stateVariables: isApps,
        },
        {
          id: "customerManagement",
          label: "Customer Management",
          icon: <FeatherIcon icon="users" className="icon-dual" />,
          link: "/customer-management",
          click: function (e) {
            e.preventDefault();
            setIsApps(!isApps);
            setIscurrentState("Apps");
            updateIconSidebar(e);
          },
          stateVariables: isApps,
        },
      ],
    },
    {
      id: "apps",
      label: "Role and Permissions",
      icon: <FeatherIcon icon="shield" className="icon-dual" />,
      link: "/role-permission-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
    {
      id: "inquiryManagement",
      label: "Inquiry Management",
      icon: <FeatherIcon icon="send" className="icon-dual" />,
      link: "/inquiry-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
    {
      id: "reportsManagement",
      label: "Reports Management",
      icon: <FeatherIcon icon="folder-minus" className="icon-dual" />,
      link: "/report-management",
      click: function (e) {
        e.preventDefault();
        setIsApps(!isApps);
        setIscurrentState("Apps");
        updateIconSidebar(e);
      },
      stateVariables: isApps,
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
