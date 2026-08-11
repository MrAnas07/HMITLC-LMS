import { Helmet } from "react-helmet-async";

const SITE_NAME = "HMITLC";
const SITE_URL = "https://hmitlc-lms.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const SEO = ({
  title,
  description,
  path = "",
  image,
  type = "website",
  noindex = false
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Hasrat Mohani IT Literacy Centre - Free IT Courses in Karachi`;
  const url = `${SITE_URL}${path}`;
  const ogImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || "Hasrat Mohani IT Literacy Centre (HMITLC) offers free and professional IT courses in Karachi, Pakistan."} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || ""} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Hasrat Mohani IT Literacy Centre" />
      <meta property="og:locale" content="en_PK" />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || ""} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default SEO;
