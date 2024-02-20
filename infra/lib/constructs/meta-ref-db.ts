import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class MetaRefDb extends Construct {

    public table: Table;

    constructor(scope: Construct) {
        super(scope, 'MetaRefDb');

        this.table = new Table(this, 'MetaRefTable', {
            tableName: 'MetaRef',
            partitionKey: { name: 'pk', type: AttributeType.STRING },
            sortKey: { name: 'sk', type: AttributeType.STRING },
            removalPolicy: RemovalPolicy.DESTROY, // Only for testing purposes. Be cautious in production.
        });

        this.table.addLocalSecondaryIndex({
            indexName: 'GameNameIndex',
            sortKey: { name: 'GameName', type: AttributeType.STRING },
        });
    }
}