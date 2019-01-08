'use strict';
/**
 * Register a piece of property for transfer
 * @param {org.acme.digitalProperty.RegisterPropertyForTransfer} rproperty register the property for transfer or not
 * @transaction
 */
async function registerPropertyForTransfer(rproperty) {   
  const NS = "org.acme.digitalProperty";
  let property4 = rproperty.property;
  property4.forTransfer = true;
  const registry = await getAssetRegistry(NS+'.Property');
  await registry.update(property4);
  
}

/**
 * Transfer a piece of property
 * @param {org.acme.digitalProperty.TransferProperty} tproperty Transfer property 
 * @transaction
 */
async function transferProperty(tproperty) {   
  const NS = "org.acme.digitalProperty";
  
  if (!tproperty.property.forTransfer) {
    throw Error('Property not for transfer.')
  } else {

    return getParticipantRegistry(NS + '.Member')
    .then(function(ownerRegistry) {
      return ownerRegistry.exists(tproperty.newOwner.getIdentifier())
    })
    .then(function(exists) {
      if(!exists) {
        throw Error('Invalid participant. Use a predefined participant.')
      } else {
        getAssetRegistry(NS + '.Property')
        .then(function (assetRegistry) {
          tproperty.property.owner = tproperty.newOwner;
          assetRegistry.update(tproperty.property);
        
          //emitting event
          let factory = getFactory();
          let propertyEvent = factory.newEvent(NS, 'TransferEvent');
          propertyEvent.property = tproperty.property;
          emit(propertyEvent);
        });
      }
    })
  }
}

/**
 * Check that the specified asset is owned by the specified participant.
 * @param {Resource} asset The asset.
 * @param {Resource} participant The participant.
 * @return {boolean} True if yes, false if no.
 */
function checkOwnership(asset, participant) {
    console.log(asset.owner.getIdentifier());
    return asset.owner.getIdentifier() === participant.getIdentifier();
  }

/**
* @param {org.acme.digitalProperty.SetupDemo} setupDemo setup demo
* @transaction
}
*/
async function setupDemo(setupDemo){
  const NS = "org.acme.digitalProperty";
  const factory = getFactory();

  //setup all the participants for demo
  const member1 = factory.newResource(NS, 'Member', 'member1');
  member1.memberOrg = 'Member 1';
  const member2 = factory.newResource(NS, 'Member', 'member2');
  member2.memberOrg = 'Member 2';
  const member3 = factory.newResource(NS, 'Member', 'member3');
  member3.memberOrg = 'Member 3';

  //create the participants just setup in the registry
  const memberRegistry = await getParticipantRegistry(NS + '.Member');
  await memberRegistry.addAll([member1, member2, member3]);
  

  //setup assets for the demo
  const property = factory.newResource(NS, 'Property', 'dp_00001');
  property.titleId = 'dp_00001';
  property.owner = member1;
  property.description = 'musci property 00001';
  property.propertyType = 'music';
  property.propertyHash = 'asdsa2wr4AS';
  property.propertyUrl = 'www.acmeproperty.com/url/123';
  property.propertyValue = 2000.12;
  property.valueCurrency = 'US Dollars';

  //create the assets just setup
  const propertyRegistry = await getAssetRegistry(NS + '.Property');
  await propertyRegistry.addAll([property]);
}
