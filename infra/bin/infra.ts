#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AddressValidatorStack } from '../lib/address-validator-stack';

const app = new cdk.App();
new AddressValidatorStack(app, 'AddressValidatorStack', {});
