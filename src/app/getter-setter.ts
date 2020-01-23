export class GetterSetter {
  private _clientId = '3MVG9_XwsqeYoueK3il2Xs5otrWbZv4V_6oUY1.v5lcO8YPk_iLjOOx0E7Jkofo8n_Zeoyq0ywAIC97aFBsNC';
  private _callbackURL = "https://sf-storm.herokuapp.com"
  private _clientSecret = '2136BDFC61EAC9E4D29439647E609C01D99CBDDBF684EAC7F98A78FF3A54BCAC';
  private _sfdcURL = 'https://login.salesforce.com/services/oauth2/authorize';
  private _endpoint = 'https://login.salesforce.com/services/oauth2/token';
  private _salesForceURL = 'https://sapient-shaibya-dev-ed--c.visualforce.com/services/data/v42.0/query/?q=SELECT+position__c,category__c,date_posted__c,body__c,Name+FROM+Post__c';
 '
  get clientId() {
    return this._clientId;
  }
  get callbackURL() {
    return this._callbackURL;
  }
  get ClientSecret() {
    return this._clientSecret;
  }
  get sfdcURL() {
    return this._sfdcURL;
  }
  get endpoint() {
    return this._endpoint;
  }
  get salesForceURL(){
    return this._salesForceURL;
  }
}
