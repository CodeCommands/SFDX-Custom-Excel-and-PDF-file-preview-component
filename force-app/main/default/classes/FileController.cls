public with sharing class FileController {
    @AuraEnabled(cacheable=true)
    public static List<ContentVersion> getVersionFiles(String recordId) {
        try {
            return [
                SELECT
                    Id,
                    Title,
                    ContentDocumentId,
                    FileExtension,
                    FirstPublishLocationId,
                    VersionDataUrl
                FROM ContentVersion
                WHERE FirstPublishLocationId = :recordId
                ORDER BY CreatedDate DESC
            ];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching files: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static String getFileContent(Id fileId) {
        try {
            ContentVersion contentVersion = [
                SELECT VersionData 
                FROM ContentVersion 
                WHERE Id = :fileId 
                LIMIT 1
            ];
            return EncodingUtil.base64Encode(contentVersion.VersionData);
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching file content: ' + e.getMessage());
        }
    }
}