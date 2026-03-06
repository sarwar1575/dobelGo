import Swal from "sweetalert2";

export interface Driver {
    id: string;
    userId: any;
    user?: any;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    alternatePhone?: string;
    profileImage?: string;
    status?: string;
    verificationStatus?: string;
    rejectionReason?: string;
    createdAt: string;
}

export const getImageUrl = (path?: string) => {
    if (!path) return "/default-user.png";
    if (path.startsWith("http")) return path;
    if (path.startsWith("data:")) return path;
    if (path.includes("uploads/")) return `/${path.replace(/^\/+/, "")}`;
    return `/uploads/profiles/${path}`;
};

export const handleView = (driver: Driver) => {
    
    const phone = driver.phoneNumber || driver.userId?.phoneNumber || driver.user?.phoneNumber || driver.userId?.phone || driver.user?.phone || "undefined";
    const status = driver.status || driver.verificationStatus || driver.userId?.status || driver.user?.status || "undefined";
    const imgUrl = getImageUrl(driver.profileImage);

    Swal.fire({
        title: "Driver Profile",
        html: `
      <div style="text-align:center;margin-bottom:15px">
        <img 
          src="${imgUrl}"
          style="width:90px;height:90px;border-radius:12px;object-fit:cover;background-color:#f0f0f0"
          onerror="this.src='/default-user.png'"
        />
      </div>

      <div style="text-align:left">

      <p><b>Name:</b> ${driver.firstName || driver.userId?.firstName || ""} ${driver.lastName || driver.userId?.lastName || ""}</p>

     

      <p><b>Phone:</b> ${phone}</p>

      <p><b>Alternate Phone:</b> ${driver.alternatePhone || "N/A"}</p>

      <p><b>Status:</b> ${status}</p>

      ${driver.rejectionReason
                ? `<p><b>Rejection Reason:</b> ${driver.rejectionReason}</p>`
                : ""
            }

      <p><b>Created:</b> ${new Date(
                driver.createdAt
            ).toLocaleDateString()}</p>

      </div>
    `,
        confirmButtonText: "Close",
        width: 500,
    });
};
