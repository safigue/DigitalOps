import { Injectable } from '@angular/core';
import { concatMap, map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

import { RestApiService } from '../rest-api/rest-api.service';


@Injectable({
  providedIn: 'root'
})
export class SharepointService {
  spRestApi = '_api/web/lists/';
  externalBaseUrl='';
  baseUrl: string = environment.sharepointBaseUrl;
  // adminGroupName: string = environment.adminGroup;
  // externalBaseUrl: string = environment.oldBaseForContactPopulation;
  data: object = {
    'queryParams': {
      '__metadata': {
        'type': 'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters'
      },
      'AllowEmailAddresses': true,
      'AllowMultipleEntities': false,
      'AllUrlZones': false,
      'MaximumEntitySuggestions': 50,
      'PrincipalSource': 15,
      'PrincipalType': 1,
      // 'QueryString': term
    }
  };

  constructor(private restApi: RestApiService) {
    this.restApi.setHeaders({
      'withCredentials': true,
      'useXDomain': true,
      'Accept': 'application/json; odata=verbose',
      // 'Content-Type': 'application/json; odata=verbose',
    });
  }

  addItem(listName: string, item: any, entityType?: string) {
    const requestUrl = `${this.baseUrl}_api/web/lists/getbytitle('${listName}')/items`;
    const ListItemEntityTypeFullName = entityType ? `SP.Data.${entityType}ListItem` : 'SP.ListItem';
    const itemObject = {};
    Object.assign(itemObject, { '__metadata': { 'type': ListItemEntityTypeFullName } }, item);
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue
        };
        return this.restApi.post(requestUrl, '', '', itemObject, headers);
      })
    );
  }

  addItemExternal(listName: string, item: any, entityType?: string) {
    const requestUrl = `${this.externalBaseUrl}_api/web/lists/getbytitle('${listName}')/items`;
    const ListItemEntityTypeFullName = entityType ? `SP.Data.${entityType}ListItem` : 'SP.ListItem';
    const itemObject = {};
    Object.assign(itemObject, { '__metadata': { 'type': ListItemEntityTypeFullName } }, item);
    return this.getExternalFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue
        };
        return this.restApi.post(requestUrl, '', '', itemObject, headers);
      })
    );
  }



  getItemCount(listName: string) {
    const requestUrl = `${this.baseUrl}/_api/web/lists/getbytitle('${listName}')/ItemCount`;
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue
        };
        return this.restApi.get(requestUrl, '', '', headers);
      })
    );
  }

  groupAddUserByLogin(group, login) {
    const requestUrl = `${this.baseUrl}/_api/web/sitegroups/getbyname('${group}')/users`;
    const itemObject = JSON.stringify({ '__metadata': { 'type': 'SP.User' }, 'LoginName': login });
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue
        };
        return this.restApi.post(requestUrl, '', '', itemObject, headers);
      })
    );
  }
  email(fromEmail: string, toEmail: string[], body: string, subject: string) {
    const requestUrl = `${this.baseUrl}/_api/SP.Utilities.Utility.SendEmail`;
    const itemObject = {
      'properties': {
        '__metadata': {
          'type': 'SP.Utilities.EmailProperties',
        },
        'From': fromEmail,
        'To': {
          'results': [environment.emailConfig.to]
        },
        'BCC': {
          'results': toEmail
        },
        'Body': body.replace(/\n/g, ''),
        'Subject': subject
      }
    };
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue
        };
        return this.restApi.post(requestUrl, '', '', itemObject, headers);
      })
    );
  }


  update(metadata, data) {
    const requestUrl = metadata.uri;
    // const ListItemEntityTypeFullName = entityType? `SP.Data.${entityType}ListItem` : 'SP.ListItem';
    const itemObject = {};
    Object.assign(itemObject, { '__metadata': { 'type': metadata.type } }, data);
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const header = {
          'If-Match': '*',
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue,
          'X-Http-Method': 'MERGE'
        };
        return this.restApi.post(requestUrl, '', '', itemObject, header);
      })
    );
  }



  createList() {
    const requestUrl = `${this.baseUrl}_api/web/lists`;
    const data = JSON.stringify(
      {
        '__metadata': { 'type': 'SP.List' },
        'AllowContentTypes': true,
        'BaseTemplate': 100,
        'ContentTypesEnabled': true,
        'Description': 'My list description',
        'Title': 'My Test List REST'
      });
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue
        };
        return this.restApi.post(requestUrl, '', '', data, headers);
      })
    );
  }
  getListDataWithCaml(listname, caml) {
    const requestUrl = `${this.baseUrl}_api/web/lists/GetByTitle('${listname}')/GetItems`;
    const requestData = { 'query': { '__metadata': { 'type': 'SP.CamlQuery' }, 'ViewXml': caml } };
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue
        };
        return this.restApi.post(requestUrl, '', '', requestData, headers);
      })
    );
  }
  addFileToList(listname, itemId, arrayBuffer, fileName) {
    const requestUrl = `${this.baseUrl}_api/web/lists/getbytitle('${listname}/items${itemId}')/AttachmentFiles/add(FileName='${fileName}')`;
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'accept': 'application/json;odata=verbose',
          // 'Content-Type': undefined,
          'X-RequestDigest': formDigest.data.d.GetContextWebInformation.FormDigestValue,
        };
        return this.restApi.post(this.baseUrl, arrayBuffer, '', headers);
      })
    );
  }
  deleteFileFromList(listname, itemId, fileName) {
    const requestUrl = `${this.baseUrl}_api/web/lists/getbytitle('${listname}/items${itemId}')/AttachmentFiles/add(FileName='${fileName}')`;
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue,
          'accept': 'application/json;odata=verbose',
          // 'Content-Type': undefined,
        };
        return this.restApi.delete(requestUrl);
      })
    );
  }
  fileUpload(serverRelativeUrlToFolder, arrayBuffer, fileName) {
    this.addFileToFolder(arrayBuffer, serverRelativeUrlToFolder, fileName).subscribe((response) => {
      this.getListItem(response.d.ListItemAllFields.__deferred.uri).subscribe((response_addFile) => {
        this.updateListItem(response_addFile.__metadata, fileName).subscribe((response_updateList) => {
          //console.log('Success', response_updateList);
        });
      });
    });
  }
  addFileToFolder(arrayBuffer, serverRelativeUrlToFolder, fileName) {
    const requestUrl = 'fileCollectionEndpoint';
    // tslint:disable-next-line:max-line-length
    const fileCollectionEndpoint = `${this.baseUrl}_api/web/getfolderbyserverrelativeurl('${serverRelativeUrlToFolder}')/files/add(overwrite=true, url='${fileName}'`;
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'accept': 'application/json;odata = verbose',
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue,
          'content-length': arrayBuffer.byteLength
        };
        return this.restApi.post(requestUrl, '', '', arrayBuffer, headers);
      })
    );
  }

  updateListItem(itemMetadata, fileName) {
    const body = JSON.stringify({ '__metadata': { 'type': itemMetadata.type }, 'FileLeafRef': fileName, 'Title': fileName });
    const requestUrl = itemMetadata.uri;
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue,
          //'content-type': 'application/json;odata=verbose',
          'content-length': body.length,
          'IF-MATCH': itemMetadata.etag,
          'X-HTTP-Method': 'MERGE'
        };
        return this.restApi.post(requestUrl, '', '', body, headers);
      })
    );
  }

  userSearch(term) {
    const requestUrl = `${this.baseUrl}_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser`;
    const data = JSON.stringify({
      'queryParams': {
        '__metadata': {
          'type': 'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters'
        },
        'AllowEmailAddresses': true,
        'AllowMultipleEntities': false,
        'AllUrlZones': false,
        'MaximumEntitySuggestions': 50,
        'PrincipalSource': 15,
        'PrincipalType': 1,
        'QueryString': term
      }
    });
    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = {
          'X-RequestDigest': formDigest.data.d.GetContextWebInformation.FormDigestValue
        };
        return this.restApi.post(requestUrl, '', '', data, headers);
      })
    );
  }

  deleteItemFromList(list, id) {

    const requestUrl = `${this.baseUrl}_api/web/lists/GetByTitle('${list}')/items(${id})`;

    return this.getFormDigest().pipe(
      concatMap((formDigest) => {
        const headers = { 
          'X-RequestDigest': formDigest.d.GetContextWebInformation.FormDigestValue,
          "IF-MATCH":"*",
          "X-HTTP-Method":"DELETE"
        };
        return this.restApi.post(requestUrl, '', '', {}, headers);
      })
    );

  }

  //  Used to obtain FormDigestValue used in POST operations
  getFormDigest() {
    const requestUrl = this.baseUrl + '_api/contextinfo';
    return this.restApi.post(requestUrl);
  }

  //  Get External FormDigestValue used in POST operations
  getExternalFormDigest() {
    const requestUrl = this.externalBaseUrl + '_api/contextinfo';
    return this.restApi.post(requestUrl);
  }

  // Obtains information from user profile
  getUser() {
    return this.restApi.get(this.baseUrl, '_api/sp.userprofiles.peoplemanager/getmyproperties');
  }
  // Queries a list with filter
  /**
   * 
   * @param listName 
   * @param query 
   * @param lessThanHunderd - optional parameter to avoid the call for item count (if you know that the count is never going to be more than 500)
   */
  getWithFilter(listName: string, query: string, greaterThanThousand?: boolean) {
    if (!greaterThanThousand) {
      return this
        .restApi
        .get(
          `${this.baseUrl}${this.spRestApi}getByTitle('${listName}')/items`,
          query.length > 0 ? query + '&$top=1000' : ''
        ).pipe(
          map(res => res.d),
          take(1)
        );
    }
    else {
      return this.restApi.get(`${this.baseUrl}${this.spRestApi}getByTitle('${listName}')/ItemCount`)
        .pipe(map(res => res.d.ItemCount),
          concatMap((itemCount: string) => {
            return this.restApi.get(`${this.baseUrl}${this.spRestApi}getByTitle('${listName}')/items`, query + `&$top=${itemCount}`)
              .pipe(map(res => res.d), take(1));
          })
        );
    }
  }


  getByTitle(listName: string, choiceField: string, queryParams: string) {
    return this.restApi.get(`${this.baseUrl}_api/web/lists/GetByTitle('${listName}')/fields?$filter=EntityPropertyName eq '${choiceField}'&${queryParams}`)
      .pipe(map(res => res.d.results));
  }

  // Obtains User Id to be used in merge/post requests
  getUserId(userName: string) {
    let accountName;
    if (userName.indexOf('i:0') == 0) { // if account name already starts with 'i:0' no need to add prefix.
      accountName = userName;
    } else {
      const prefix = 'i:0#.w|';
      accountName = prefix + userName;
    }

    return this.restApi.get(`${this.baseUrl}_api/web/siteusers(@v)?@v='${encodeURIComponent(accountName)}'`);
  }
  // Obtains list Id (e.g.: 2e2ed506-5be4-4e6b-976c-9b1576385678)
  getListId(listName: string) {
    return this.restApi.get(`${this.baseUrl}${this.spRestApi}getbytitle('${listName}')/Id`);
  }
  // Queries a list and loads all its fields
  getListItems(listname) {
    return this.restApi.get(`${this.baseUrl}${this.spRestApi}getbytitle('${listname}')/items`).pipe(map(res => {
      return res['d'];
    }));
  }
  // Obtains a list of members of a SharePoint Group
  getGroupMembers(group) {
    return this.restApi.get(`${this.baseUrl}_api/web/sitegroups/getbyname('${group}')/users`);
  }

  getUserGroups() {
    return this.restApi.get(`${this.baseUrl}_api/web/CurrentUser/Groups`);
  }

  // Queries list the fields data with filter
  getFieldsWithFilter(listname, filter) {
    return this.restApi.get(`${this.baseUrl}${this.spRestApi}getbytitle('${listname}')/Fields`, filter).pipe(map(res => {
      return res['d'];
    }));
  }
  // Search the query
  search(filter, rowlimit, startRow) {
    return this.restApi.get(`${this.baseUrl}_api/search/query?querytext=${filter}&${rowlimit}=${rowlimit}&${startRow}=${startRow}`);
  }

  getListItem(fileListItemUri) {
    return this.restApi.get(`${fileListItemUri}`);
  }

  getGroupMemberId(group, id) {
    return this.restApi.get(`${this.baseUrl}_api/web/sitegroups/getbyname('${group}')/users/getbyid('${id}')`);
  }

  getUserAdminGroup(list) {
    return this.restApi.get(`${this.baseUrl}_api/web/CurrentUser/Groups?$filter=Title eq'${list}'&$select=Title`);
  }
}
