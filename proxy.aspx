<%@ Page Language="C#" AutoEventWireup="true" %>
<%@ Import Namespace="System.Net" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web" %>
<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        Response.ContentType = "application/json";
        string q = ((char)34).ToString();
        string user = Request.QueryString["username"];
        
        if (string.IsNullOrEmpty(user))
        {
            Response.StatusCode = 400;
            Response.Write(q + "error" + q + ":" + q + "Missing user" + q);
            return;
        }

        try
        {
            string url = "https://kick.com/api/v1/channels/" + HttpUtility.UrlEncode(user);
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.UserAgent = "Mozilla/5.0";
            req.Timeout = 5000;
            
            HttpWebResponse res = (HttpWebResponse)req.GetResponse();
            StreamReader sr = new StreamReader(res.GetResponseStream());
            string json = sr.ReadToEnd();
            sr.Close();
            res.Close();
            
            // Avoid using " in the search string
            int idIdx = json.IndexOf("id");
            if (idIdx != -1)
            {
                // Search for the colon after 'id'
                int colonIdx = json.IndexOf(":", idIdx);
                if (colonIdx != -1)
                {
                    int commaIdx = json.IndexOf(",", colonIdx);
                    if (commaIdx == -1) commaIdx = json.IndexOf("}", colonIdx);
                    
                    string id = json.Substring(colonIdx + 1, commaIdx - (colonIdx + 1)).Trim();
                    Response.Write(q + "id" + q + ":" + id);
                }
                else
                {
                    Response.StatusCode = 404;
                    Response.Write(q + "error" + q + ":" + q + "No ID" + q);
                }
            }
            else
            {
                Response.StatusCode = 404;
                Response.Write(q + "error" + q + ":" + q + "No ID" + q);
            }
        }
        catch (Exception ex)
        {
            Response.StatusCode = 500;
            Response.Write(q + "error" + q + ":" + q + "Error" + q);
        }
    }
</script>
