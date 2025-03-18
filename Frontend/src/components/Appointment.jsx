import React from "react";

export default function Appointment() {
  const customers = [
    { name: "Hayleys", logo: "https://www.hayleys.com/wp-content/uploads/2020/10/Hayleys_logo.png" },
    { name: "HEMAS", logo: "https://hemas.com/assets/images/logo/hemas-logo-color.png" },
    { name: "LOLC", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/LOLC_Holdings_logo.jpg" },
    // { name: "Company D", logo: "https://via.placeholder.com/100" },
  ];

  return (
    <div className="container-fluid py-6 px-5">
      <div className="row gx-5">
        <div className="col-12">
          <div className="mb-4 text-center">
            <h1 className="display-5 text-uppercase mb-4">
              <span className="text-dark">Our Customers</span>
            </h1>
          </div>
          <div className="row justify-content-center">
            {customers.map((customer, index) => (
              <div key={index} className="col-md-3 text-center mb-4">
                <img
                  src={customer.logo}
                  alt={customer.name}
                  className="img-fluid mb-2"
                  style={{ maxWidth: "180px" }}
                />
                <h5 className="text-uppercase">{customer.name}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
